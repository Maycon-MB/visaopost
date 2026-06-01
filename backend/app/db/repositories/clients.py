"""Queries da tabela `clients` — base de clientes da ótica pra recall WhatsApp.

`observations` mora em `metadata.observations` (jsonb). Demais campos de CRM
(nascimento, consentimento, origem, convênio, lente, armação, compra, retorno,
bairro) são colunas dedicadas (migration 0006).
"""

from __future__ import annotations

import json
from datetime import date as DateType
from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

import asyncpg

from app.db.pool import acquire
from app.models.client import Client, ClientCreate, ClientUpdate

# Lista única de colunas — usada em todo SELECT/RETURNING.
_COLS = """
    id, tenant_id, name, phone, email, last_exam_date, last_contacted_at,
    status, metadata, created_at, birth_date, consent_whatsapp, consent_at,
    source, health_plan, lens_type, frame_brand, last_purchase_date,
    last_purchase_value_brl, next_return_date, neighborhood
"""


class ClientPhoneConflict(Exception):
    """UNIQUE (tenant_id, phone) violada."""


def _row_to_client(row: asyncpg.Record) -> Client:
    metadata = row["metadata"]
    if isinstance(metadata, str):
        metadata = json.loads(metadata)
    elif metadata is None:
        metadata = {}
    observations = metadata.get("observations") if isinstance(metadata, dict) else None
    value = row["last_purchase_value_brl"]
    return Client(
        id=row["id"],
        tenant_id=row["tenant_id"],
        name=row["name"],
        phone=row["phone"],
        email=row["email"],
        last_exam_date=row["last_exam_date"],
        last_contacted_at=row["last_contacted_at"],
        status=row["status"],
        observations=observations,
        created_at=row["created_at"],
        birth_date=row["birth_date"],
        consent_whatsapp=row["consent_whatsapp"],
        consent_at=row["consent_at"],
        source=row["source"],
        health_plan=row["health_plan"],
        lens_type=row["lens_type"],
        frame_brand=row["frame_brand"],
        last_purchase_date=row["last_purchase_date"],
        last_purchase_value_brl=float(value) if value is not None else None,
        next_return_date=row["next_return_date"],
        neighborhood=row["neighborhood"],
    )


def _money(v: float | None) -> Decimal | None:
    return Decimal(str(v)) if v is not None else None


async def create_client(tenant_id: UUID, payload: ClientCreate) -> Client:
    """Insere cliente. Levanta `ClientPhoneConflict` se telefone duplicado no tenant."""
    metadata: dict[str, Any] = {}
    if payload.observations:
        metadata["observations"] = payload.observations
    consent_at = datetime.now() if payload.consent_whatsapp else None

    try:
        async with acquire() as conn:
            row = await conn.fetchrow(
                f"""
                INSERT INTO clients (
                    tenant_id, name, phone, email, last_exam_date, status, metadata,
                    birth_date, consent_whatsapp, consent_at, source, health_plan,
                    lens_type, frame_brand, last_purchase_date, last_purchase_value_brl,
                    next_return_date, neighborhood
                )
                VALUES ($1, $2, $3, $4, $5, 'active', $6::jsonb,
                        $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING {_COLS}
                """,
                tenant_id,
                payload.name,
                payload.phone,
                payload.email,
                payload.last_exam_date,
                json.dumps(metadata),
                payload.birth_date,
                payload.consent_whatsapp,
                consent_at,
                payload.source,
                payload.health_plan,
                payload.lens_type,
                payload.frame_brand,
                payload.last_purchase_date,
                _money(payload.last_purchase_value_brl),
                payload.next_return_date,
                payload.neighborhood,
            )
    except asyncpg.UniqueViolationError as exc:
        raise ClientPhoneConflict(
            f"telefone {payload.phone} já existe pra tenant {tenant_id}"
        ) from exc

    assert row is not None  # INSERT ... RETURNING sempre devolve linha em sucesso
    return _row_to_client(row)


async def list_clients(
    tenant_id: UUID,
    *,
    search: str | None = None,
    status: str | None = "active",
    exam_before: DateType | None = None,
    limit: int = 100,
    offset: int = 0,
) -> list[Client]:
    """Lista clientes com filtros opcionais. Default = active, top 100 mais recentes."""
    conditions = ["tenant_id = $1"]
    values: list[object] = [tenant_id]
    idx = 2

    if status is not None:
        conditions.append(f"status = ${idx}")
        values.append(status)
        idx += 1

    if search:
        conditions.append(f"(name ILIKE ${idx} OR phone LIKE ${idx})")
        values.append(f"%{search}%")
        idx += 1

    if exam_before is not None:
        conditions.append(f"(last_exam_date IS NULL OR last_exam_date <= ${idx})")
        values.append(exam_before)
        idx += 1

    values.extend([limit, offset])
    sql = f"""
        SELECT {_COLS}
        FROM clients
        WHERE {" AND ".join(conditions)}
        ORDER BY created_at DESC
        LIMIT ${idx} OFFSET ${idx + 1}
    """

    async with acquire() as conn:
        rows = await conn.fetch(sql, *values)
    return [_row_to_client(r) for r in rows]


async def get_client(tenant_id: UUID, client_id: UUID) -> Client | None:
    async with acquire() as conn:
        row = await conn.fetchrow(
            f"SELECT {_COLS} FROM clients WHERE id = $1 AND tenant_id = $2",
            client_id,
            tenant_id,
        )
    return None if row is None else _row_to_client(row)


async def update_client(
    tenant_id: UUID,
    client_id: UUID,
    patch: ClientUpdate,
) -> Client | None:
    """Atualiza campos não-None. None nas saídas = cliente não existe nesse tenant."""
    sets: list[str] = []
    values: list[object] = []
    idx = 1

    # Campos escalares simples: (coluna, valor).
    simple: list[tuple[str, object]] = []
    if patch.name is not None:
        simple.append(("name", patch.name))
    if patch.phone is not None:
        simple.append(("phone", patch.phone))
    if patch.email is not None:
        simple.append(("email", patch.email))
    if patch.last_exam_date is not None:
        simple.append(("last_exam_date", patch.last_exam_date))
    if patch.status is not None:
        simple.append(("status", patch.status))
    if patch.birth_date is not None:
        simple.append(("birth_date", patch.birth_date))
    if patch.source is not None:
        simple.append(("source", patch.source))
    if patch.health_plan is not None:
        simple.append(("health_plan", patch.health_plan))
    if patch.lens_type is not None:
        simple.append(("lens_type", patch.lens_type))
    if patch.frame_brand is not None:
        simple.append(("frame_brand", patch.frame_brand))
    if patch.last_purchase_date is not None:
        simple.append(("last_purchase_date", patch.last_purchase_date))
    if patch.last_purchase_value_brl is not None:
        simple.append(("last_purchase_value_brl", _money(patch.last_purchase_value_brl)))
    if patch.next_return_date is not None:
        simple.append(("next_return_date", patch.next_return_date))
    if patch.neighborhood is not None:
        simple.append(("neighborhood", patch.neighborhood))

    for col, val in simple:
        sets.append(f"{col} = ${idx}")
        values.append(val)
        idx += 1

    # Consentimento: ao ligar, registra a data; ao desligar, limpa.
    if patch.consent_whatsapp is not None:
        sets.append(f"consent_whatsapp = ${idx}")
        values.append(patch.consent_whatsapp)
        idx += 1
        sets.append("consent_at = " + ("now()" if patch.consent_whatsapp else "NULL"))

    if patch.observations is not None:
        # Merge no metadata jsonb existente, sem dropar outras chaves.
        sets.append(f"metadata = COALESCE(metadata,'{{}}'::jsonb) || ${idx}::jsonb")
        values.append(json.dumps({"observations": patch.observations}))
        idx += 1

    if not sets:
        return await get_client(tenant_id, client_id)

    values.extend([client_id, tenant_id])
    sql = f"""
        UPDATE clients
        SET {", ".join(sets)}
        WHERE id = ${idx} AND tenant_id = ${idx + 1}
        RETURNING {_COLS}
    """

    try:
        async with acquire() as conn:
            row = await conn.fetchrow(sql, *values)
    except asyncpg.UniqueViolationError as exc:
        raise ClientPhoneConflict(
            f"telefone {patch.phone!r} já existe pra outro cliente desse tenant"
        ) from exc
    return None if row is None else _row_to_client(row)


async def delete_client(tenant_id: UUID, client_id: UUID) -> bool:
    """Hard delete. Retorna True se removeu, False se não existia."""
    async with acquire() as conn:
        status: str = await conn.execute(
            "DELETE FROM clients WHERE id = $1 AND tenant_id = $2",
            client_id,
            tenant_id,
        )
    return status == "DELETE 1"


async def mark_client_contacted(
    tenant_id: UUID,
    client_id: UUID,
    when: datetime | None = None,
) -> Client | None:
    """Atualiza `last_contacted_at` (default = now). Usado pelo bot WhatsApp."""
    timestamp = when or datetime.now()
    async with acquire() as conn:
        row = await conn.fetchrow(
            f"""
            UPDATE clients
            SET last_contacted_at = $1
            WHERE id = $2 AND tenant_id = $3
            RETURNING {_COLS}
            """,
            timestamp,
            client_id,
            tenant_id,
        )
    return None if row is None else _row_to_client(row)


async def count_clients(tenant_id: UUID, *, status: str | None = "active") -> int:
    """Total de clientes pra paginação na UI."""
    async with acquire() as conn:
        if status is None:
            result = await conn.fetchval(
                "SELECT count(*) FROM clients WHERE tenant_id = $1", tenant_id
            )
        else:
            result = await conn.fetchval(
                "SELECT count(*) FROM clients WHERE tenant_id = $1 AND status = $2",
                tenant_id,
                status,
            )
    return int(result or 0)
