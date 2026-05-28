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
from typing import Any

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
