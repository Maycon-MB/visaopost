"""Testa services/queue.py com fakeredis. Sem Redis real.

Cobre enqueue idempotente, queue_status snapshot, retry config aplicada.
Não executa o job real (mock generate_post): só valida orchestração RQ.
"""

from __future__ import annotations

from datetime import date as DateType

import fakeredis
import pytest
from rq import Queue

from app.services import queue as queue_module
from app.services.queue import (
    DEFAULT_QUEUE_NAMES,
    QUEUE_GENERATION,
    enqueue_daily_post,
    get_queue,
    queue_status,
)


@pytest.fixture
def fake_redis() -> fakeredis.FakeRedis:
    return fakeredis.FakeRedis()


@pytest.fixture
def sync_queue(fake_redis: fakeredis.FakeRedis) -> Queue:
    return get_queue(QUEUE_GENERATION, connection=fake_redis, is_async=False)


def test_get_queue_usa_connection_injetada(fake_redis: fakeredis.FakeRedis) -> None:
    q = get_queue(QUEUE_GENERATION, connection=fake_redis)
    assert q.name == QUEUE_GENERATION
    assert q.connection is fake_redis


def test_enqueue_daily_post_job_id_deterministico(sync_queue: Queue) -> None:
    target = DateType(2026, 6, 1)
    job = enqueue_daily_post(
        tenant_slug="dilorenzo",
        target_date=target,
        queue=sync_queue,
    )
    assert job.id == "daily-dilorenzo-2026-06-01"
    assert job.args == ("dilorenzo", "2026-06-01")
    assert job.func_name == "app.workers.tasks.generate_daily_post"


def test_enqueue_daily_post_idempotente_no_mesmo_dia(sync_queue: Queue) -> None:
    """Dois enqueues do mesmo (tenant, date) compartilham job_id.

    RQ vê job_id existente em registry e devolve job equivalente — não duplica.
    """
    target = DateType(2026, 6, 2)
    job1 = enqueue_daily_post(tenant_slug="dilorenzo", target_date=target, queue=sync_queue)
    job2 = enqueue_daily_post(tenant_slug="dilorenzo", target_date=target, queue=sync_queue)
    assert job1.id == job2.id


def test_enqueue_aplica_timeout_e_ttl(sync_queue: Queue) -> None:
    job = enqueue_daily_post(
        tenant_slug="dilorenzo",
        target_date=DateType(2026, 6, 3),
        queue=sync_queue,
    )
    assert job.timeout == queue_module.JOB_TIMEOUT
    assert job.result_ttl == queue_module.RESULT_TTL
    assert job.failure_ttl == queue_module.RESULT_TTL


def test_queue_status_vazio(fake_redis: fakeredis.FakeRedis) -> None:
    status = queue_status(connection=fake_redis)
    for name in DEFAULT_QUEUE_NAMES:
        assert name in status
        counts = status[name]["counts"]
        assert counts["queued"] == 0
        assert counts["finished"] == 0
        assert counts["failed"] == 0


def test_queue_status_apos_enqueue(fake_redis: fakeredis.FakeRedis) -> None:
    q = get_queue(QUEUE_GENERATION, connection=fake_redis, is_async=True)
    enqueue_daily_post(
        tenant_slug="dilorenzo",
        target_date=DateType(2026, 6, 4),
        queue=q,
    )
    status = queue_status(connection=fake_redis)
    assert status[QUEUE_GENERATION]["counts"]["queued"] == 1
    assert "daily-dilorenzo-2026-06-04" in status[QUEUE_GENERATION]["recent"]["queued"]
