"""Queries da tabela `clients` — base de clientes da ótica pra recall WhatsApp.

`observations` mora em `metadata.observations` (jsonb) — schema atual não tem
coluna dedicada e seria over-migration adicionar. Outras notas livres futuras
vão pelo mesmo jsonb.
"""

from __future__ import annotations

import json
from datetime import date as DateType
from datetime import datetime
from typing import Any
from uuid import UUID

import asyncpg

from app.db.pool import acquire
from app.models.client import Client, ClientCreate, ClientUpdate


class ClientPhoneConflict(Exception):
    """UNIQUE (tenant_id, phone) violada."""


def _row_to_client(row: asyncpg.Record) -> Client:
    metadata = row["metadata"]
    if isinstance(metadata, str):
        metadata = json.loads(metadata)
    elif metadata is None:
        metadata = {}
    observations = metadata.get("observations") if isinstance(metadata, dict) else None
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
    )


async def create_client(tenant_id: UUID, payload: ClientCreate) -> Client:
    """Insere cliente. Levanta `ClientPhoneConflict` se telefone duplicado no tenant."""
    metadata: dict[str, Any] = {}
    if payload.observations:
        metadata["observations"] = payload.observations

    try:
        async with acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO clients (
                    tenant_id, name, phone, email, last_exam_date,
                    status, metadata
                )
                VALUES ($1, $2, $3, $4, $5, 'active', $6::jsonb)
                RETURNING id, tenant_id, name, phone, email, last_exam_date,
                          last_contacted_at, status, metadata, created_at
                """,
                tenant_id,
                payload.name,
                payload.phone,
                payload.email,
                payload.last_exam_date,
                json.dumps(metadata),
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
        SELECT id, tenant_id, name, phone, email, last_exam_date,
               last_contacted_at, status, metadata, created_at
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
            """
            SELECT id, tenant_id, name, phone, email, last_exam_date,
                   last_contacted_at, status, metadata, created_at
            FROM clients
            WHERE id = $1 AND tenant_id = $2
            """,
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

    if patch.name is not None:
        sets.append(f"name = ${idx}")
        values.append(patch.name)
        idx += 1
    if patch.phone is not None:
        sets.append(f"phone = ${idx}")
        values.append(patch.phone)
        idx += 1
    if patch.email is not None:
        sets.append(f"email = ${idx}")
        values.append(patch.email)
        idx += 1
    if patch.last_exam_date is not None:
        sets.append(f"last_exam_date = ${idx}")
        values.append(patch.last_exam_date)
        idx += 1
    if patch.status is not None:
        sets.append(f"status = ${idx}")
        values.append(patch.status)
        idx += 1
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
        RETURNING id, tenant_id, name, phone, email, last_exam_date,
                  last_contacted_at, status, metadata, created_at
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
            """
            UPDATE clients
            SET last_contacted_at = $1
            WHERE id = $2 AND tenant_id = $3
            RETURNING id, tenant_id, name, phone, email, last_exam_date,
                      last_contacted_at, status, metadata, created_at
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
