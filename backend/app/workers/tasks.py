"""Jobs RQ. Funções sync (RQ exige callable importável e síncrono).

`generate_daily_post` é o entrypoint que o RQ-Scheduler enfileira no cron 06h.
Internamente roda o pipeline async via `asyncio.run` — cada worker tem seu
próprio event loop por job, sem contaminação cruzada.

Retorno do job = dict serializável (RQ persiste em Redis). Nunca devolver
Pydantic ou asyncpg.Record.
"""

from __future__ import annotations

import asyncio
from datetime import date as DateType
from pathlib import Path
from typing import Any, cast
from uuid import UUID

from app.db.pool import close_pool, init_pool
from app.logging import configure_logging, get_logger
from app.services.post_generator import TenantNotFound, generate_post

logger = get_logger(__name__)

DEFAULT_OUTPUT_DIR = Path(__file__).resolve().parents[2] / "tmp" / "posts"


def generate_daily_post(
    tenant_slug: str,
    target_date_iso: str,
    output_dir: str | None = None,
) -> dict[str, Any]:
    """Job síncrono executado pelo worker RQ.

    Args:
        tenant_slug: ex. "dilorenzo".
        target_date_iso: data alvo "YYYY-MM-DD".
        output_dir: opcional, override do diretório de JPEG.

    Returns:
        dict serializável persistido pelo RQ. `status` = ok | tenant_not_found | error.

    Raises:
        Re-raise para o RQ marcar o job FAILED quando o erro NÃO for esperado.
        TenantNotFound vira retorno `{"status": "tenant_not_found"}` (não estoura).
    """
    target = DateType.fromisoformat(target_date_iso)
    out = Path(output_dir) if output_dir else DEFAULT_OUTPUT_DIR
    return asyncio.run(_run(tenant_slug, target, out))


async def _run(tenant_slug: str, target: DateType, out_dir: Path) -> dict[str, Any]:
    configure_logging()
    await init_pool()
    try:
        try:
            post = await generate_post(
                tenant_slug=tenant_slug,
                target_date=target,
                output_dir=out_dir,
            )
        except TenantNotFound as exc:
            logger.error("job.tenant_missing", tenant=tenant_slug, error=str(exc))
            return {"status": "tenant_not_found", "tenant": tenant_slug, "error": str(exc)}
    finally:
        await close_pool()

    return {
        "status": "ok",
        "tenant": tenant_slug,
        "date": target.isoformat(),
        "post_id": str(post.id),
        "theme": post.theme,
        "mood": post.mood,
        "holiday_name": post.holiday_name,
        "image_url": post.image_url,
    }


# ─── Instagram publish ────────────────────────────────────────────────────────

def publish_instagram_post(post_id_str: str) -> dict[str, Any]:
    """Publica post aprovado no Instagram via Graph API.

    Chamado pelo worker RQ da fila `instagram_publish`.
    post_id_str: UUID em string (RQ serializa args como JSON).
    """
    return asyncio.run(_run_ig_publish(UUID(post_id_str)))


async def _run_ig_publish(post_id: UUID) -> dict[str, Any]:
    configure_logging()
    await init_pool()
    try:
        from app.db.repositories.posts import list_approved_due, mark_as_posted
        from app.services.instagram import get_instagram_client

        # Recarrega o post do DB pra pegar credenciais do tenant.
        posts = await list_approved_due(limit=100)
        post = next((p for p in posts if p.id == post_id), None)
        if not post:
            logger.warning("ig_publish.post_not_found_or_not_due", post_id=str(post_id))
            return {"status": "skipped", "reason": "not_found_or_not_due", "post_id": str(post_id)}

        if not post.image_url:
            logger.error("ig_publish.no_image_url", post_id=str(post_id))
            return {"status": "error", "reason": "no_image_url", "post_id": str(post_id)}

        caption_with_tags = post.caption
        if post.hashtags:
            tags = " ".join(f"#{t.lstrip('#')}" for t in post.hashtags)
            caption_with_tags = f"{post.caption}\n\n{tags}"

        client = get_instagram_client(
            access_token=post.instagram_access_token or None,
            account_id=post.instagram_business_account_id or None,
        )
        result = await client.publish_photo(
            image_url=post.image_url,
            caption=caption_with_tags,
        )
        await mark_as_posted(post_id, instagram_post_id=result.media_id)
        logger.info(
            "ig_publish.ok",
            post_id=str(post_id),
            media_id=result.media_id,
            permalink=result.permalink,
        )
        return {
            "status": "ok",
            "post_id": str(post_id),
            "media_id": result.media_id,
            "permalink": result.permalink,
        }
    except Exception as exc:
        logger.error("ig_publish.failed", post_id=str(post_id), error=str(exc))
        raise
    finally:
        await close_pool()


def collect_instagram_metrics(post_id_str: str, media_id: str, tenant_id_str: str) -> dict[str, Any]:
    """Snapshot de métricas de um post publicado. Rodar 24h+ após publicação."""
    return asyncio.run(_run_ig_metrics(UUID(post_id_str), media_id, UUID(tenant_id_str)))


async def _run_ig_metrics(post_id: UUID, media_id: str, tenant_id: UUID) -> dict[str, Any]:
    configure_logging()
    await init_pool()
    try:
        from app.db.repositories.posts import upsert_instagram_metrics
        from app.services.instagram import get_instagram_client

        client = get_instagram_client()
        metrics = await client.get_metrics(media_id)
        await upsert_instagram_metrics(
            tenant_id=tenant_id,
            post_id=post_id,
            reach=metrics.reach,
            impressions=metrics.impressions,
            likes=metrics.likes,
            comments=metrics.comments,
            saves=metrics.saved,
            shares=metrics.shares,
        )
        logger.info("ig_metrics.ok", post_id=str(post_id), reach=metrics.reach)
        return {
            "status": "ok",
            "post_id": str(post_id),
            "reach": metrics.reach,
            "impressions": metrics.impressions,
            "likes": metrics.likes,
        }
    except Exception as exc:
        logger.error("ig_metrics.failed", post_id=str(post_id), error=str(exc))
        raise
    finally:
        await close_pool()


# ─── Instagram publish dispatcher ──────────────────────────────────────────────

def dispatch_due_instagram_publishes() -> dict[str, Any]:
    """Varre posts aprovados com `scheduled_at` já vencido e enfileira a publicação.

    Enfileirar direto na ação de aprovar seria errado: o post pode estar
    agendado pra mais tarde, e `_run_ig_publish` só publica o que já está
    devido (via `list_approved_due`). Esse dispatcher fecha o loop — roda
    periódico (cron RQ-Scheduler, wiring real na Fase 8; `job_id`
    determinístico em `enqueue_instagram_publish` evita duplicata se rodar
    mais de uma vez antes do worker processar).
    """
    return asyncio.run(_run_dispatch_due_publishes())


async def _run_dispatch_due_publishes() -> dict[str, Any]:
    configure_logging()
    await init_pool()
    try:
        from app.db.repositories.posts import list_approved_due
        from app.services.queue import enqueue_instagram_publish

        due = await list_approved_due(limit=100)
        for post in due:
            enqueue_instagram_publish(post_id=post.id)
        logger.info("ig_publish.dispatched", count=len(due))
        return {"status": "ok", "dispatched": len(due)}
    finally:
        await close_pool()


# ─── WhatsApp recall ──────────────────────────────────────────────────────────

def send_recall_batch(tenant_slug: str) -> dict[str, Any]:
    """Envia recall WhatsApp pra clientes com exame > 12 meses.

    Chamado pelo RQ-Scheduler toda segunda-feira às 10h.
    """
    return asyncio.run(_run_recall(tenant_slug))


async def _run_recall(tenant_slug: str) -> dict[str, Any]:
    configure_logging()
    await init_pool()
    try:
        from app.services.whatsapp import send_recall_batch as _recall
        return await _recall(tenant_slug)
    except Exception as exc:
        logger.error("recall.task_failed", tenant=tenant_slug, error=str(exc))
        raise
    finally:
        await close_pool()


# ─── Instagram OAuth token expiry ──────────────────────────────────────────────

def check_instagram_token_expiry() -> dict[str, Any]:
    """Avisa (log estruturado) sobre tokens Instagram perto de expirar.

    Fase 10g ainda vai decidir o canal de alerta pro Maycon (WhatsApp/email) —
    este job só produz o sinal, não notifica ninguém sozinho. Rodar via cron
    semanal (wiring do RQ-Scheduler acontece na Fase 8, junto com o resto).
    """
    return asyncio.run(_run_check_token_expiry())


async def _run_check_token_expiry() -> dict[str, Any]:
    configure_logging()
    await init_pool()
    try:
        from datetime import datetime as _datetime

        from app.db.repositories.tenants import list_tenants_with_expiring_instagram_token

        expiring = await list_tenants_with_expiring_instagram_token(within_days=7)
        for tenant in expiring:
            expires_at = cast(_datetime, tenant["instagram_token_expires_at"])
            logger.warning(
                "ig_token.expiring_soon",
                tenant_id=str(tenant["id"]),
                slug=tenant["slug"],
                business_name=tenant["business_name"],
                expires_at=expires_at.isoformat(),
            )
        return {"status": "ok", "expiring_count": len(expiring)}
    finally:
        await close_pool()
