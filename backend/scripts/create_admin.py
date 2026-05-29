"""Cria (ou redefine a senha) da conta owner do painel pra um tenant.

Uso dev: `python -m scripts.create_admin`
Idempotente: se o email já existe no tenant, só atualiza a senha/role.
"""

from __future__ import annotations

import asyncio
import os
from pathlib import Path

import asyncpg

from app.config import get_settings
from app.services.auth import hash_password

SLUG = os.environ.get("ADMIN_SLUG", "dilorenzo")
NAME = os.environ.get("ADMIN_NAME", "Admin")
USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
EMAIL = os.environ.get("ADMIN_EMAIL", "admin@dilorenzo.local")
PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")


async def main() -> None:
    dsn = get_settings().database_url.replace("postgresql+asyncpg", "postgresql")
    conn = await asyncpg.connect(dsn)
    try:
        tenant_id = await conn.fetchval("SELECT id FROM tenants WHERE slug = $1", SLUG)
        if tenant_id is None:
            print(f"tenant {SLUG!r} nao existe (rode as migrations + seed)")
            return
        pw_hash = hash_password(PASSWORD)
        existing = await conn.fetchval(
            "SELECT id FROM admin_users WHERE tenant_id = $1 AND (lower(email) = lower($2) OR lower(username) = lower($3))",
            tenant_id, EMAIL, USERNAME,
        )
        if existing:
            await conn.execute(
                "UPDATE admin_users SET password_hash=$1, status='active', role='owner', name=$2, username=$3, email=$4 WHERE id=$5",
                pw_hash, NAME, USERNAME.lower(), EMAIL.lower(), existing,
            )
            print(f"owner atualizado ({existing})")
        else:
            uid = await conn.fetchval(
                """
                INSERT INTO admin_users (tenant_id, name, username, email, role, status, password_hash)
                VALUES ($1, $2, $3, $4, 'owner', 'active', $5) RETURNING id
                """,
                tenant_id, NAME, USERNAME.lower(), EMAIL.lower(), pw_hash,
            )
            print(f"owner criado ({uid})")
    finally:
        await conn.close()
    print(f"\nlogin:  {USERNAME}  (ou {EMAIL})\nsenha:  {PASSWORD}")


if __name__ == "__main__":
    os.chdir(Path(__file__).resolve().parent.parent)
    asyncio.run(main())
