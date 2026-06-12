"""Endpoints para Scripts de Reels de Autoridade.

POST /reels/generate  → gera via Gemini + grava
GET  /reels           → lista histórico (20 últimos)
GET  /reels/{id}      → detalhe
DELETE /reels/{id}    → remove
"""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.api.auth import current_tenant_id
from app.db.repositories.reels import (
    create_reel_script,
    delete_reel_script,
    get_reel_script,
    list_reel_scripts,
)
from app.logging import get_logger
from app.models.reel import ReelScript, ReelScriptCreate
from app.services.reel_generator import generate_reel_script

router = APIRouter(prefix="/reels", tags=["reels"])
logger = get_logger(__name__)


@router.post("/generate", response_model=ReelScript, status_code=201)
async def generate(
    payload: ReelScriptCreate,
    tenant_id: UUID = Depends(current_tenant_id),
) -> ReelScript:
    """Gera roteiro via Gemini e salva no banco."""
    try:
        output, meta = generate_reel_script(payload=payload)
    except RuntimeError as exc:
        logger.error("reels.generate_failed", tenant_id=str(tenant_id), error=str(exc))
        raise HTTPException(status_code=502, detail="Falha ao gerar roteiro. Tente novamente.") from exc
    script = await create_reel_script(tenant_id, payload, output)
    logger.info("reels.created", script_id=str(script.id), **{k: meta[k] for k in ("tema", "tom", "duracao_s", "attempts")})
    return script


@router.get("", response_model=list[ReelScript])
async def list_scripts(tenant_id: UUID = Depends(current_tenant_id)) -> list[ReelScript]:
    return await list_reel_scripts(tenant_id)


@router.get("/{script_id}", response_model=ReelScript)
async def get_script(
    script_id: UUID,
    tenant_id: UUID = Depends(current_tenant_id),
) -> ReelScript:
    script = await get_reel_script(tenant_id, script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Roteiro não encontrado")
    return script


@router.delete("/{script_id}", status_code=204, response_model=None)
async def delete_script(
    script_id: UUID,
    tenant_id: UUID = Depends(current_tenant_id),
) -> None:
    deleted = await delete_reel_script(tenant_id, script_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Roteiro não encontrado")
