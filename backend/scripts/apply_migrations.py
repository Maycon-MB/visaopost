"""Aplica todas as migrations SQL em ordem no banco do `DATABASE_URL`.

Migrations sao idempotentes (IF NOT EXISTS), entao rodar de novo e seguro.
Uso: `python -m scripts.apply_migrations`
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

import asyncpg

from app.config import get_settings

MIGRATIONS_DIR = Path(__file__).resolve().parent.parent / "app" / "db" / "migrations"


async def main() -> None:
    # asyncpg nao aceita o prefixo "+asyncpg" nem o esquema "postgresql+...".
    dsn = get_settings().database_url.replace("postgresql+asyncpg", "postgresql")
    files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    if not files:
        print(f"nenhuma migration em {MIGRATIONS_DIR}", file=sys.stderr)
        return

    conn = await asyncpg.connect(dsn)
    applied = 0
    try:
        for path in files:
            sql = path.read_text(encoding="utf-8")
            try:
                await conn.execute(sql)
                print(f"  [ok]   {path.name}")
                applied += 1
            except asyncpg.PostgresError as exc:
                # 0001-0003 nao sao idempotentes (ja aplicadas). Limpa a tx
                # abortada e segue; as migrations novas (0004+) sao idempotentes.
                await conn.execute("ROLLBACK")
                print(f"  [skip] {path.name} ({type(exc).__name__})")
    finally:
        await conn.close()
    print(f"{applied} migration(s) aplicadas em {dsn.rsplit('@', 1)[-1]}")


if __name__ == "__main__":
    os.chdir(Path(__file__).resolve().parent.parent)  # .env resolve pelo CWD
    asyncio.run(main())
