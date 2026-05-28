"""Endpoints `/api/settings` — leitura e patch das configs do tenant.

Mesma estratégia transitória dos clients: tenant via query `?tenant=<slug>` até
ter sessão real. Fase 10 substitui pela extração do JWT do dono.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.db.repositories.tenants import get_tenant_settings, update_tenant_settings
from app.logging import get_logger
from app.models.settings import TenantSettings, TenantSettingsUpdate

router = APIRouter(prefix="/api/settings", tags=["settings"])
logger = get_logger(__name__)


@router.get("", response_model=TenantSettings)
async def read_settings(
    tenant: str = Query(..., description="Slug do tenant"),
) -> TenantSettings:
    settings = await get_tenant_settings(tenant)
    if settings is None:
        raise HTTPException(status_code=404, detail=f"tenant {tenant!r} não encontrado")
    return settings


@router.patch("", response_model=TenantSettings)
async def patch_settings(
    patch: TenantSettingsUpdate,
    tenant: str = Query(..., description="Slug do tenant"),
) -> TenantSettings:
    updated = await update_tenant_settings(tenant, patch)
    if updated is None:
        raise HTTPException(status_code=404, detail=f"tenant {tenant!r} não encontrado")
    logger.info(
        "settings.updated",
        tenant=tenant,
        fields=[k for k, v in patch.model_dump().items() if v is not None],
    )
    return updated
