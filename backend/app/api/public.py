"""Endpoints públicos — sem autenticação, dados não-sensíveis.

/public/{tenant_slug}/gallery  → lista posts aprovados/publicados (JSON)
/public/{tenant_slug}/catalog  → lista produtos ativos do catálogo (JSON)
/posts/{post_id}.jpg           → serve JPEG gerado (mesma URL gravada em posts.image_url)
"""

from __future__ import annotations

from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.db.repositories.posts import PublicPost, list_public_posts
from app.db.repositories.products import list_products
from app.db.repositories.tenants import get_tenant_id_by_slug
from app.logging import get_logger
from app.models.product import Product

router = APIRouter(tags=["public"])
logger = get_logger(__name__)

POSTS_DIR = Path(__file__).resolve().parents[2] / "tmp" / "posts"


@router.get("/public/{tenant_slug}/gallery", response_model=list[PublicPost])
async def gallery(tenant_slug: str, limit: int = 30) -> list[PublicPost]:
    """Posts aprovados/publicados de um tenant. Para a galeria pública."""
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=422, detail="limit deve estar entre 1 e 100")
    posts = await list_public_posts(tenant_slug, limit=limit)
    if not posts:
        # tenant inexistente e tenant sem posts retornam o mesmo: lista vazia
        return []
    return posts


@router.get("/public/{tenant_slug}/catalog", response_model=list[Product])
async def catalog(tenant_slug: str) -> list[Product]:
    """Produtos ativos de um tenant. Para o catálogo público domiciliar."""
    tid = await get_tenant_id_by_slug(tenant_slug)
    if tid is None:
        return []
    return await list_products(tid)


@router.get("/posts/{post_id}.jpg")
async def serve_post_image(post_id: UUID) -> FileResponse:
    """Serve JPEG gerado. Em produção nginx assume essa rota via alias."""
    path = POSTS_DIR / f"{post_id}.jpg"
    if not path.is_file():
        raise HTTPException(status_code=404, detail="imagem não encontrada")
    return FileResponse(path, media_type="image/jpeg")
