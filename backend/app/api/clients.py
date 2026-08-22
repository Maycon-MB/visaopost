"""CRUD de clients pra recall WhatsApp.

Tenant vem do token de sessão do dono (Depends current_tenant_id) — multi-tenant
garantido pelo JWT, sem ?tenant= na URL.

Import CSV: 1 cliente por linha, header obrigatório `name,phone,email,last_exam_date,observations`.
Linhas inválidas são reportadas no response (`failed`), mas as válidas são inseridas.
"""

from __future__ import annotations

import csv
import io
from datetime import date as DateType
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import ValidationError

from app.api.auth import current_tenant_id
from app.db.repositories.clients import (
    ClientPhoneConflict,
    count_clients,
    create_client,
    delete_client,
    get_client,
    list_clients,
    mark_client_contacted,
    update_client,
)
from app.logging import get_logger
from app.models.client import Client, ClientCreate, ClientUpdate

router = APIRouter(prefix="/api/clients", tags=["clients"])
logger = get_logger(__name__)

_CSV_HEADER = ("name", "phone", "email", "last_exam_date", "observations")


@router.get("", response_model=dict[str, Any])
async def list_endpoint(
    tenant_id: UUID = Depends(current_tenant_id),
    search: str | None = Query(default=None),
    status: str | None = Query(default="active"),
    exam_before: DateType | None = Query(default=None, description="Filtra exame anterior à data"),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
) -> dict[str, Any]:
    # "all" (ou vazio) = sem filtro de status; qualquer outro valor filtra exato.
    status_filter = None if status in (None, "", "all") else status
    rows = await list_clients(
        tenant_id,
        search=search,
        status=status_filter,
        exam_before=exam_before,
        limit=limit,
        offset=offset,
    )
    total = await count_clients(tenant_id, status=status_filter)
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": [c.model_dump(mode="json") for c in rows],
    }


@router.post("", response_model=Client, status_code=201)
async def create_endpoint(
    payload: ClientCreate,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Client:
    try:
        return await create_client(tenant_id, payload)
    except ClientPhoneConflict as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.get("/export.csv")
async def export_csv(
    tenant_id: UUID = Depends(current_tenant_id),
    status: str | None = Query(default=None),
) -> StreamingResponse:
    """Exporta todos os clients (ou filtrado por status) em CSV."""
    rows = await list_clients(tenant_id, status=status, limit=10_000)
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=_CSV_HEADER)
    writer.writeheader()
    for client in rows:
        writer.writerow(
            {
                "name": client.name,
                "phone": client.phone,
                "email": client.email or "",
                "last_exam_date": client.last_exam_date.isoformat() if client.last_exam_date else "",
                "observations": client.observations or "",
            }
        )
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="clientes.csv"'},
    )


@router.post("/import")
async def import_csv(
    file: UploadFile,
    tenant_id: UUID = Depends(current_tenant_id),
) -> dict[str, Any]:
    """Importa CSV. Header obrigatório. Retorna resumo `{inserted, skipped, failed[]}`."""
    raw = (await file.read()).decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(raw))
    if reader.fieldnames is None or not set(_CSV_HEADER[:2]).issubset(reader.fieldnames):
        raise HTTPException(
            status_code=422,
            detail=f"CSV precisa de header com pelo menos {list(_CSV_HEADER[:2])}",
        )

    inserted = 0
    skipped = 0
    failed: list[dict[str, Any]] = []
    for line_num, row in enumerate(reader, start=2):  # linha 1 = header
        try:
            payload = ClientCreate(
                name=row.get("name", "").strip(),
                phone=row.get("phone", "").strip(),
                email=row.get("email") or None,
                last_exam_date=DateType.fromisoformat(row["last_exam_date"])
                if row.get("last_exam_date")
                else None,
                observations=row.get("observations") or None,
            )
        except (ValidationError, ValueError) as exc:
            failed.append({"line": line_num, "error": str(exc)[:200]})
            continue
        try:
            await create_client(tenant_id, payload)
            inserted += 1
        except ClientPhoneConflict:
            skipped += 1

    logger.info("clients.import", inserted=inserted, skipped=skipped, failed=len(failed))
    return {"inserted": inserted, "skipped_duplicates": skipped, "failed": failed}


@router.get("/{client_id}", response_model=Client)
async def get_endpoint(
    client_id: UUID,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Client:
    client = await get_client(tenant_id, client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="cliente não encontrado")
    return client


@router.patch("/{client_id}", response_model=Client)
async def update_endpoint(
    client_id: UUID,
    patch: ClientUpdate,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Client:
    try:
        client = await update_client(tenant_id, client_id, patch)
    except ClientPhoneConflict as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    if client is None:
        raise HTTPException(status_code=404, detail="cliente não encontrado")
    return client


@router.post("/{client_id}/contacted", response_model=Client)
async def mark_contacted_endpoint(
    client_id: UUID,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Client:
    """Marca `last_contacted_at = now`. Botão 'marcar contatado' da tela /clientes."""
    client = await mark_client_contacted(tenant_id, client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="cliente não encontrado")
    return client


@router.delete("/{client_id}", status_code=204, response_class=Response)
async def delete_endpoint(
    client_id: UUID,
    tenant_id: UUID = Depends(current_tenant_id),
) -> Response:
    ok = await delete_client(tenant_id, client_id)
    if not ok:
        raise HTTPException(status_code=404, detail="cliente não encontrado")
    return Response(status_code=204)
