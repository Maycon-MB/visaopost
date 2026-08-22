"""Endpoints DEV — bypass auth, só pra teste manual local Fase 3+.

Router só carrega quando APP_ENV=dev (ver main.py).
"""

from __future__ import annotations

from datetime import date as DateType
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, HTMLResponse, Response
from pydantic import BaseModel, Field

from app.config import get_settings
from app.db.repositories.holidays import find_holiday_by_theme
from app.db.repositories.tenants import get_brand_kit
from app.logging import get_logger
from app.models.brand import ThemeContext
from app.services.post_generator import TenantNotFound, generate_post
from app.services.queue import enqueue_daily_post, queue_status
from app.services.renderer import render_html_to_jpeg
from app.services.template_generator import generate_post_html

router = APIRouter(prefix="/dev", tags=["dev"])
logger = get_logger(__name__)

POSTS_DIR = Path(__file__).resolve().parents[2] / "tmp" / "posts"


class GeneratePostBody(BaseModel):
    """Payload do endpoint dev de geração diária."""

    tenant: str = Field(min_length=1, description="Slug do tenant em `tenants.slug`")
    date: DateType = Field(description="Data alvo do post (ISO YYYY-MM-DD)")


class IGPublishTestBody(BaseModel):
    """Payload do endpoint dev de publicação Instagram."""

    image_url: str = Field(description="URL pública da imagem (acessível pelo Meta)")
    caption: str = Field(default="", description="Legenda + hashtags do post")


@router.get("/preview/{theme}", response_class=Response)
async def dev_preview_jpeg(
    theme: str,
    tenant: str = Query(default="dilorenzo"),
    mood: str | None = Query(default=None),
    return_html: bool = Query(default=False, description="Se true, retorna HTML em vez do JPEG"),
) -> Response:
    """Gera post completo (Gemini→HTML→JPEG) pro tema do tenant."""
    brand = await get_brand_kit(tenant)
    if brand is None:
        raise HTTPException(status_code=404, detail=f"tenant '{tenant}' não encontrado")

    holiday = await find_holiday_by_theme(theme)
    ctx = ThemeContext(
        theme=theme,
        mood=mood or (holiday.mood if holiday else None),
        holiday_name=holiday.name if holiday else None,
    )

    html, meta = generate_post_html(brand=brand, theme=ctx)
    logger.info("dev.preview.html_ready", tenant=tenant, **meta)

    if return_html:
        return HTMLResponse(content=html)

    jpeg = await render_html_to_jpeg(html)
    return Response(
        content=jpeg,
        media_type="image/jpeg",
        headers={"Cache-Control": "no-store"},
    )


@router.post("/generate-post")
async def dev_generate_post(body: GeneratePostBody) -> dict[str, object]:
    """Gera post completo (copy + HTML + JPEG) e persiste em `posts`.

    Body: `{"tenant": "dilorenzo", "date": "2026-06-01"}`.
    Retorna: `{post_id, theme, mood, holiday_name, image_url, caption_preview}`.
    """
    try:
        post = await generate_post(
            tenant_slug=body.tenant,
            target_date=body.date,
            output_dir=POSTS_DIR,
        )
    except TenantNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    logger.info(
        "dev.generate_post.ok",
        tenant=body.tenant,
        date=body.date.isoformat(),
        post_id=str(post.id),
        theme=post.theme,
    )

    return {
        "post_id": str(post.id),
        "theme": post.theme,
        "mood": post.mood,
        "holiday_name": post.holiday_name,
        "image_url": post.image_url,
        "caption_preview": post.caption[:120],
        "hashtags": post.hashtags,
        "cta": post.cta,
    }


@router.get("/posts/{post_id}.jpg", response_class=FileResponse)
async def dev_serve_post_jpeg(post_id: str) -> FileResponse:
    """Serve JPEG salvo localmente em `backend/tmp/posts/`. Dev-only."""
    safe_id = post_id.replace("/", "").replace("\\", "")
    file_path = POSTS_DIR / f"{safe_id}.jpg"
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail=f"jpeg '{safe_id}' não encontrado")
    return FileResponse(file_path, media_type="image/jpeg")


@router.get("/health/services")
async def dev_health_services() -> dict[str, object]:
    settings = get_settings()
    return {
        "env": settings.app_env,
        "gemini_configured": bool(settings.gemini_api_key),
        "resend_configured": bool(settings.resend_api_key),
    }


@router.post("/queue/enqueue-daily")
async def dev_enqueue_daily(body: GeneratePostBody) -> dict[str, object]:
    """Enfileira o job de geração diária em vez de rodar inline.

    Body: `{"tenant": "dilorenzo", "date": "2026-06-01"}`. Exige Redis up.
    """
    try:
        job = enqueue_daily_post(tenant_slug=body.tenant, target_date=body.date)
    except Exception as exc:
        logger.warning("dev.enqueue.redis_down", error=str(exc))
        raise HTTPException(status_code=503, detail=f"redis unavailable: {exc}") from exc

    logger.info(
        "dev.enqueue.ok",
        tenant=body.tenant,
        date=body.date.isoformat(),
        job_id=job.id,
    )
    return {"job_id": job.id, "queue": job.origin, "status": job.get_status()}


@router.post("/instagram/dispatch-due")
async def dev_dispatch_due_publishes() -> dict[str, object]:
    """Roda manualmente o dispatcher de publicações devidas (real: cron RQ-Scheduler, Fase 8)."""
    from app.workers.tasks import _run_dispatch_due_publishes

    return await _run_dispatch_due_publishes()


@router.post("/instagram/check-token-expiry")
async def dev_check_token_expiry() -> dict[str, object]:
    """Roda manualmente a checagem de tokens Instagram perto de expirar."""
    from app.workers.tasks import _run_check_token_expiry

    return await _run_check_token_expiry()


@router.post("/instagram/publish-test")
async def dev_instagram_publish_test(body: IGPublishTestBody) -> dict[str, object]:
    """Publica post de teste no Instagram real. Requer IG_ACCESS_TOKEN + IG_ACCOUNT_ID no .env.

    Body: `{"image_url": "https://...", "caption": "legenda #hashtag"}`.
    image_url deve ser uma URL pública acessível pelo Meta.
    """
    from app.services.instagram import get_instagram_client

    try:
        client = get_instagram_client()
        result = await client.publish_photo(image_url=body.image_url, caption=body.caption)
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    logger.info("dev.instagram.published", media_id=result.media_id, permalink=result.permalink)
    return {"media_id": result.media_id, "permalink": result.permalink}


@router.get("/instagram/metrics/{media_id}")
async def dev_instagram_metrics(media_id: str) -> dict[str, object]:
    """Coleta métricas de um post publicado. Requer IG_ACCESS_TOKEN no .env."""
    from app.services.instagram import get_instagram_client

    try:
        client = get_instagram_client()
        metrics = await client.get_metrics(media_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return metrics.model_dump()


@router.get("/queue/status")
async def dev_queue_status() -> dict[str, object]:
    """Snapshot RQ: counts por fila + amostra de jobs recentes. 503 se Redis down."""
    try:
        return queue_status()
    except Exception as exc:
        logger.warning("dev.queue_status.redis_down", error=str(exc))
        raise HTTPException(status_code=503, detail=f"redis unavailable: {exc}") from exc
