"""Endpoints `/api/settings` — leitura e patch das configs do tenant.

Tenant vem do token de sessão do dono (Depends current_tenant_id).
"""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.api.auth import current_tenant_id
from app.db.repositories.tenants import get_tenant_settings, update_tenant_settings
from app.logging import get_logger
from app.models.settings import TenantSettings, TenantSettingsUpdate

router = APIRouter(prefix="/api/settings", tags=["settings"])
logger = get_logger(__name__)


@router.get("", response_model=TenantSettings)
async def read_settings(
    tenant_id: UUID = Depends(current_tenant_id),
) -> TenantSettings:
    settings = await get_tenant_settings(tenant_id)
    if settings is None:
        raise HTTPException(status_code=404, detail="tenant não encontrado")
    return settings


@router.patch("", response_model=TenantSettings)
async def patch_settings(
    patch: TenantSettingsUpdate,
    tenant_id: UUID = Depends(current_tenant_id),
) -> TenantSettings:
    updated = await update_tenant_settings(tenant_id, patch)
    if updated is None:
        raise HTTPException(status_code=404, detail="tenant não encontrado")
    logger.info(
        "settings.updated",
        tenant_id=str(tenant_id),
        fields=[k for k, v in patch.model_dump().items() if v is not None],
    )
    return updated
