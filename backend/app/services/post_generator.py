"""Orquestra geração diária ponta a ponta.

Pipeline:
    resolve_brand → resolve_theme → generate_post_copy → generate_post_html
    → render_html_to_jpeg → grava JPEG → repo.create_post

Saída JPEG em `backend/tmp/posts/{post_id}.jpg` (Fase 8 migra pra storage externo).
Testes injetam fakes via monkeypatch — mesma estratégia de `test_dev_endpoint`.
"""

from __future__ import annotations

from datetime import date as DateType
from datetime import datetime, time, timedelta, timezone
from pathlib import Path
from uuid import UUID, uuid4

from app.db.repositories.posts import create_post
from app.db.repositories.tenants import get_brand_kit, get_tenant_id_by_slug
from app.logging import get_logger
from app.models.post import Post
from app.services.calendar import resolve_theme
from app.services.caption import generate_post_copy
from app.services.renderer import render_html_to_jpeg
from app.services.stock_photos import pick_for_theme as pick_stock_photo
from app.services.template_generator import generate_post_html

logger = get_logger(__name__)

DEFAULT_PUBLISH_HOUR = 12  # meio-dia BRT
# Brasil sem DST desde 2019 — offset fixo UTC-3 evita dep tzdata no Windows.
DEFAULT_TZ = timezone(timedelta(hours=-3), name="America/Sao_Paulo")


class TenantNotFound(Exception):
    """Tenant ausente ou inativo no DB."""


async def generate_post(
    *,
    tenant_slug: str,
    target_date: DateType,
    output_dir: Path,
    publish_hour: int = DEFAULT_PUBLISH_HOUR,
) -> Post:
    """Gera post completo para a data e persiste em `posts` + grava JPEG no disco."""
    brand = await get_brand_kit(tenant_slug)
    if brand is None:
        raise TenantNotFound(f"tenant '{tenant_slug}' não encontrado ou inativo")

    tenant_id = await get_tenant_id_by_slug(tenant_slug)
    if tenant_id is None:
        # Defensive: get_brand_kit já filtra is_active, mas mantém invariante explícita.
        raise TenantNotFound(f"tenant_id ausente para slug '{tenant_slug}'")

    theme_ctx = await resolve_theme(target_date)

    stock_uri = pick_stock_photo(
        target_date=target_date,
        theme=theme_ctx.theme,
        mood=theme_ctx.mood,
    )
    if stock_uri is not None:
        theme_ctx = theme_ctx.model_copy(update={"product_image_data_uri": stock_uri})

    copy, copy_meta = generate_post_copy(brand=brand, theme=theme_ctx)
    html, html_meta = generate_post_html(brand=brand, theme=theme_ctx)
    jpeg = await render_html_to_jpeg(html)

    post_id = uuid4()
    output_dir.mkdir(parents=True, exist_ok=True)
    file_path = output_dir / f"{post_id}.jpg"
    file_path.write_bytes(jpeg)
    image_url = _local_image_url(post_id)

    scheduled_at = datetime.combine(target_date, time(publish_hour, 0), tzinfo=DEFAULT_TZ)

    post = await create_post(
        tenant_id=tenant_id,
        scheduled_at=scheduled_at,
        theme=theme_ctx.theme,
        caption=copy.caption,
        hashtags=copy.hashtags,
        cta=copy.cta,
        status="draft",
        mood=theme_ctx.mood,
        holiday_name=theme_ctx.holiday_name,
        image_url=image_url,
        ai_html=html,
        ai_prompt={
            "caption": copy_meta,
            "html": html_meta,
        },
    )

    # Renomeia arquivo pra UUID definitivo do DB (idempotente: já é o uuid).
    if post.id != post_id:
        new_path = output_dir / f"{post.id}.jpg"
        file_path.rename(new_path)
        file_path = new_path

    logger.info(
        "post.generated",
        post_id=str(post.id),
        tenant_slug=tenant_slug,
        theme=post.theme,
        mood=post.mood,
        holiday_name=post.holiday_name,
        file_path=str(file_path),
        jpeg_bytes=len(jpeg),
    )
    return post


def _local_image_url(post_id: UUID) -> str:
    """URL relativa servida pelo backend em dev. Fase 8 migra para CDN/VPS."""
    return f"/posts/{post_id}.jpg"
