"""Queries de `password_resets` — tokens de 'esqueci a senha', single-use.

Guarda só o hash do token. O token cru vive apenas no email do usuário.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from app.db.pool import acquire


async def create_reset(user_id: UUID, token_hash: str, expires_at: datetime) -> None:
    async with acquire() as conn:
        await conn.execute(
            "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
            user_id, token_hash, expires_at,
        )


async def get_valid_reset(token_hash: str) -> UUID | None:
    """Devolve o id do reset se existir, não usado e não expirado. Senão None."""
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id FROM password_resets
            WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
            """,
            token_hash,
        )
    return None if row is None else row["id"]


async def get_user_id_for_reset(token_hash: str) -> UUID | None:
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT user_id FROM password_resets
            WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
            """,
            token_hash,
        )
    return None if row is None else row["user_id"]


async def mark_used(reset_id: UUID) -> None:
    async with acquire() as conn:
        await conn.execute("UPDATE password_resets SET used_at = now() WHERE id = $1", reset_id)


async def invalidate_user_resets(user_id: UUID) -> None:
    """Queima tokens pendentes do usuário (após troca de senha)."""
    async with acquire() as conn:
        await conn.execute(
            "UPDATE password_resets SET used_at = now() WHERE user_id = $1 AND used_at IS NULL",
            user_id,
        )
