"""Helper RQ. Resolve Redis + queues + enqueue tipado.

Por que helper: chamadas RQ espalhadas viram bug (queue name digitada errado,
TTL inconsistente, sem reconnect). Aqui é o ponto único.

Fase 5 = infra pronta sem Redis rodando. Em dev local sem Redis, qualquer chamada
falha em `redis.from_url`. Use `get_queue(connection=fake)` em testes.
"""

from __future__ import annotations

from datetime import date as DateType
from uuid import UUID
from typing import Any, cast

import redis
from rq import Queue
from rq.job import Job

from app.config import get_settings

QUEUE_GENERATION = "post_generation"
QUEUE_PUBLISHING = "instagram_publish"
DEFAULT_QUEUE_NAMES: tuple[str, ...] = (QUEUE_GENERATION, QUEUE_PUBLISHING)

# Free tier Gemini 20 req/dia + paid latência variável. RQ retry nativo: 3 tentativas,
# backoff 60s. Combinado com call_with_backoff in-process: até 15 retries efetivos.
JOB_MAX_RETRIES = 3
JOB_RETRY_INTERVAL = 60  # seconds
# JPEG geração + Gemini calls + Playwright boot. 5min folga em rede lenta.
JOB_TIMEOUT = 300
# Resultado fica 7 dias em Redis pro dashboard inspecionar.
RESULT_TTL = 7 * 24 * 3600


def get_redis_connection(redis_url: str | None = None) -> redis.Redis:
    """Conecta no Redis. URL via env por default."""
    url = redis_url or get_settings().redis_url
    return cast(redis.Redis, redis.from_url(url))  # type: ignore[no-untyped-call]


def get_queue(
    name: str = QUEUE_GENERATION,
    connection: redis.Redis | None = None,
    is_async: bool = True,
) -> Queue:
    """Fábrica de Queue. `is_async=False` em testes pra rodar inline."""
    conn = connection or get_redis_connection()
    return Queue(name, connection=conn, is_async=is_async)


def enqueue_daily_post(
    *,
    tenant_slug: str,
    target_date: DateType,
    queue: Queue | None = None,
) -> Job:
    """Enfileira o job de geração diária pro tenant/data.

    job_id determinístico = `daily-{tenant}-{date}` previne duplicata se cron
    dispara 2x no mesmo dia. RQ ignora enqueue se job_id já existe em estado ativo.
    """
    q = queue or get_queue(QUEUE_GENERATION)
    job_id = f"daily-{tenant_slug}-{target_date.isoformat()}"
    return q.enqueue(
        "app.workers.tasks.generate_daily_post",
        args=(tenant_slug, target_date.isoformat()),
        job_id=job_id,
        retry=_build_retry(),
        result_ttl=RESULT_TTL,
        failure_ttl=RESULT_TTL,
        job_timeout=JOB_TIMEOUT,
    )


def enqueue_instagram_publish(
    *,
    post_id: UUID,
    queue: Queue | None = None,
) -> Job:
    """Enfileira publicação de post aprovado no Instagram.

    job_id determinístico = `ig-publish-{post_id}` evita duplicata se
    o cron de publicação dispara mais de uma vez antes do worker processar.
    """
    q = queue or get_queue(QUEUE_PUBLISHING)
    job_id = f"ig-publish-{post_id}"
    return q.enqueue(
        "app.workers.tasks.publish_instagram_post",
        args=(str(post_id),),
        job_id=job_id,
        retry=_build_retry(),
        result_ttl=RESULT_TTL,
        failure_ttl=RESULT_TTL,
        job_timeout=JOB_TIMEOUT,
    )


def enqueue_instagram_metrics(
    *,
    post_id: UUID,
    media_id: str,
    tenant_id: UUID,
    queue: Queue | None = None,
) -> Job:
    """Enfileira coleta de métricas 24h após publicação."""
    q = queue or get_queue(QUEUE_PUBLISHING)
    job_id = f"ig-metrics-{post_id}"
    return q.enqueue(
        "app.workers.tasks.collect_instagram_metrics",
        args=(str(post_id), media_id, str(tenant_id)),
        job_id=job_id,
        retry=_build_retry(),
        result_ttl=RESULT_TTL,
        failure_ttl=RESULT_TTL,
        job_timeout=120,
    )


def enqueue_recall_batch(
    *,
    tenant_slug: str,
    queue: Queue | None = None,
) -> Job:
    """Enfileira envio de recall WhatsApp pra clientes com exame > 12 meses."""
    q = queue or get_queue(QUEUE_GENERATION)
    job_id = f"recall-{tenant_slug}"
    return q.enqueue(
        "app.workers.tasks.send_recall_batch",
        args=(tenant_slug,),
        job_id=job_id,
        retry=_build_retry(),
        result_ttl=RESULT_TTL,
        failure_ttl=RESULT_TTL,
        job_timeout=300,
    )


def _build_retry() -> Any:
    """Lazy import — `rq.Retry` esteve sob refactor entre versões."""
    from rq import Retry

    return Retry(max=JOB_MAX_RETRIES, interval=JOB_RETRY_INTERVAL)


def queue_status(connection: redis.Redis | None = None) -> dict[str, Any]:
    """Snapshot de cada fila: counts por estado + 10 jobs recentes de cada estado."""
    conn = connection or get_redis_connection()
    out: dict[str, Any] = {}
    for name in DEFAULT_QUEUE_NAMES:
        q = Queue(name, connection=conn)
        registries = {
            "queued": q.get_job_ids(0, 9),
            "started": q.started_job_registry.get_job_ids(0, 9),
            "finished": q.finished_job_registry.get_job_ids(0, 9),
            "failed": q.failed_job_registry.get_job_ids(0, 9),
            "deferred": q.deferred_job_registry.get_job_ids(0, 9),
            "scheduled": q.scheduled_job_registry.get_job_ids(0, 9),
        }
        out[name] = {
            "counts": {
                "queued": q.count,
                "started": q.started_job_registry.count,
                "finished": q.finished_job_registry.count,
                "failed": q.failed_job_registry.count,
                "deferred": q.deferred_job_registry.count,
                "scheduled": q.scheduled_job_registry.count,
            },
            "recent": registries,
        }
    return out
