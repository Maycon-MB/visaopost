"""CRUD de products — catálogo de produtos da ótica.

Tenant vem do token de sessão (current_tenant_id).
Imagens: dev = backend/tmp/products/{tenant_id}/{product_id}.{ext}
         prod (Fase 8) = Backblaze B2.
"""

from __future__ import annotations

import uuid
from pathlib import Path
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import Response
from fastapi.responses import FileResponse

from app.api.auth import current_tenant_id
from app.db.repositories.products import (
    create_product,
    delete_product,
    get_product,
    list_products,
    set_product_image,
    update_product,
)
from app.logging import get_logger
from app.models.product import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["products"])
logger = get_logger(__name__)

_IMAGES_DIR = Path(__file__).resolve().parents[2] / "tmp" / "products"
_ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
_MAX_SIZE = 8 * 1024 * 1024  # 8 MB


def _image_dir(tenant_id: UUID) -> Path:
    d = _IMAGES_DIR / str(tenant_id)
    d.mkdir(parents=True, exist_ok=True)
    return d


# ── List ─────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[Product])
async def list_endpoint(
    tenant_id: UUID = Depends(current_tenant_id),
    include_inactive: bool = False,
) -> list[Product]:
    return await list_products(tenant_id, include_inactive=include_inactive)


# ── Create (JSON, sem imagem) ─────────────────────────────────────────────────

@router.post("", response_model=Product, status_code=201)
async def create_endpoint(
    payload: ProductCreate,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Product:
    return await create_product(tenant_id, payload)


# ── Upload imagem ─────────────────────────────────────────────────────────────

@router.post("/{product_id}/image", response_model=Product)
async def upload_image(
    product_id: UUID,
    file: UploadFile = File(...),
    tenant_id: UUID = Depends(current_tenant_id),
) -> Product:
    if file.content_type not in _ALLOWED_MIME:
        raise HTTPException(status_code=415, detail="Formato não suportado. Use JPEG, PNG ou WebP.")

    data = await file.read()
    if len(data) > _MAX_SIZE:
        raise HTTPException(status_code=413, detail="Imagem muito grande. Máximo 8 MB.")

    ext = (file.filename or "img").rsplit(".", 1)[-1].lower()
    if ext not in {"jpg", "jpeg", "png", "webp"}:
        ext = "jpg"

    dest = _image_dir(tenant_id) / f"{product_id}.{ext}"
    dest.write_bytes(data)

    image_url = f"/api/products/images/{tenant_id}/{product_id}.{ext}"
    product = await set_product_image(tenant_id, product_id, image_url)
    if product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return product


# ── Serve imagem local ────────────────────────────────────────────────────────

@router.get("/images/{tenant_id}/{filename}")
async def serve_image(tenant_id: str, filename: str) -> FileResponse:
    # Sanitiza filename para evitar path traversal
    safe = Path(filename).name
    path = _IMAGES_DIR / tenant_id / safe
    if not path.exists():
        raise HTTPException(status_code=404, detail="Imagem não encontrada.")
    return FileResponse(path)


# ── Update ─────────────────────────────────────────────────────────────────────

@router.patch("/{product_id}", response_model=Product)
async def update_endpoint(
    product_id: UUID,
    payload: ProductUpdate,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Product:
    product = await update_product(tenant_id, product_id, payload)
    if product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return product


# ── Delete ─────────────────────────────────────────────────────────────────────

@router.delete("/{product_id}", status_code=204, response_class=Response)
async def delete_endpoint(
    product_id: UUID,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Response:
    deleted = await delete_product(tenant_id, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return Response(status_code=204)
