"""Queries de `admin_users` — usuários que logam no painel do dono."""

from __future__ import annotations

from uuid import UUID

import asyncpg

from app.db.pool import acquire
from app.models.admin import AdminUser, AdminUserWithHash

_COLS = (
    "id, tenant_id, name, phone, email, role, status, last_login_at, created_at"
)


class AdminEmailConflict(Exception):
    """UNIQUE (tenant_id, lower(email)) violada."""


def _to_user(row: asyncpg.Record) -> AdminUser:
    return AdminUser(
        id=row["id"], tenant_id=row["tenant_id"], name=row["name"], phone=row["phone"],
        email=row["email"], role=row["role"], status=row["status"],
        last_login_at=row["last_login_at"], created_at=row["created_at"],
    )


def _to_user_hash(row: asyncpg.Record) -> AdminUserWithHash:
    return AdminUserWithHash(
        id=row["id"], tenant_id=row["tenant_id"], name=row["name"], phone=row["phone"],
        email=row["email"], role=row["role"], status=row["status"],
        last_login_at=row["last_login_at"], created_at=row["created_at"],
        password_hash=row["password_hash"],
    )


async def list_by_email(email: str) -> list[AdminUserWithHash]:
    """Busca por email (usado no 'esqueci a senha')."""
    async with acquire() as conn:
        rows = await conn.fetch(
            f"SELECT {_COLS}, password_hash FROM admin_users WHERE lower(email) = lower($1)",
            email,
        )
    return [_to_user_hash(r) for r in rows]


async def list_by_identifier(identifier: str) -> list[AdminUserWithHash]:
    """Busca por email OU nome de usuário (usado no login)."""
    async with acquire() as conn:
        rows = await conn.fetch(
            f"""
            SELECT {_COLS}, password_hash FROM admin_users
            WHERE lower(email) = lower($1) OR lower(username) = lower($1)
            """,
            identifier,
        )
    return [_to_user_hash(r) for r in rows]


async def get_by_id(user_id: UUID) -> AdminUser | None:
    async with acquire() as conn:
        row = await conn.fetchrow(f"SELECT {_COLS} FROM admin_users WHERE id = $1", user_id)
    return None if row is None else _to_user(row)


async def update_last_login(user_id: UUID) -> None:
    async with acquire() as conn:
        await conn.execute("UPDATE admin_users SET last_login_at = now() WHERE id = $1", user_id)


async def set_password(user_id: UUID, password_hash: str) -> None:
    """Define a senha e ativa a conta (caso fosse convite pendente)."""
    async with acquire() as conn:
        await conn.execute(
            "UPDATE admin_users SET password_hash = $1, status = 'active' WHERE id = $2",
            password_hash, user_id,
        )


async def create_admin(
    *, tenant_id: UUID, name: str, email: str, role: str, status: str,
    password_hash: str | None,
) -> AdminUser:
    try:
        async with acquire() as conn:
            row = await conn.fetchrow(
                f"""
                INSERT INTO admin_users (tenant_id, name, email, role, status, password_hash)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING {_COLS}
                """,
                tenant_id, name, email.lower(), role, status, password_hash,
            )
    except asyncpg.UniqueViolationError as exc:
        raise AdminEmailConflict(f"email {email} já existe nesse tenant") from exc
    assert row is not None
    return _to_user(row)


async def list_by_tenant(tenant_id: UUID) -> list[AdminUser]:
    async with acquire() as conn:
        rows = await conn.fetch(
            f"SELECT {_COLS} FROM admin_users WHERE tenant_id = $1 ORDER BY created_at",
            tenant_id,
        )
    return [_to_user(r) for r in rows]


async def update_profile(
    user_id: UUID,
    *,
    name: str | None = None,
    phone: str | None = None,
) -> AdminUser | None:
    sets: list[str] = []
    values: list[object] = []
    idx = 1
    if name is not None:
        sets.append(f"name = ${idx}")
        values.append(name)
        idx += 1
    if phone is not None:
        sets.append(f"phone = ${idx}")
        values.append(phone)
        idx += 1
    if not sets:
        return await get_by_id(user_id)
    values.append(user_id)
    sql = f"UPDATE admin_users SET {', '.join(sets)} WHERE id = ${idx} RETURNING {_COLS}"
    async with acquire() as conn:
        row = await conn.fetchrow(sql, *values)
    return None if row is None else _to_user(row)
