"""Repositório para reel_scripts. Zero ORM, asyncpg puro."""

from __future__ import annotations

from uuid import UUID

from app.db.pool import acquire
from app.models.reel import ReelScript, ReelScriptCreate, ReelScriptOutput, ReelTom

_COLS = (
    "id, tenant_id, tema, produto, duracao_s, tom, "
    "hook, roteiro, legenda, hashtags, cta_verbal, cta_legenda, created_at"
)


def _row_to_reel(row) -> ReelScript:
    return ReelScript(
        id=row["id"],
        tenant_id=row["tenant_id"],
        tema=row["tema"],
        produto=row["produto"],
        duracao_s=row["duracao_s"],
        tom=ReelTom(row["tom"]),
        hook=row["hook"],
        roteiro=row["roteiro"],
        legenda=row["legenda"],
        hashtags=list(row["hashtags"]),
        cta_verbal=row["cta_verbal"],
        cta_legenda=row["cta_legenda"],
        created_at=row["created_at"],
    )


async def create_reel_script(
    tenant_id: UUID,
    payload: ReelScriptCreate,
    output: ReelScriptOutput,
) -> ReelScript:
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO reel_scripts
                (tenant_id, tema, produto, duracao_s, tom,
                 hook, roteiro, legenda, hashtags, cta_verbal, cta_legenda)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::text[],$11,$12)
            RETURNING """ + _COLS,
            tenant_id,
            payload.tema,
            payload.produto,
            payload.duracao_s,
            payload.tom.value,
            output.hook,
            output.roteiro,
            output.legenda,
            output.hashtags,
            output.cta_verbal,
            output.cta_legenda,
        )
    return _row_to_reel(row)


async def list_reel_scripts(tenant_id: UUID, limit: int = 20) -> list[ReelScript]:
    async with acquire() as conn:
        rows = await conn.fetch(
            f"SELECT {_COLS} FROM reel_scripts WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2",
            tenant_id,
            limit,
        )
    return [_row_to_reel(r) for r in rows]


async def get_reel_script(tenant_id: UUID, script_id: UUID) -> ReelScript | None:
    async with acquire() as conn:
        row = await conn.fetchrow(
            f"SELECT {_COLS} FROM reel_scripts WHERE id = $1 AND tenant_id = $2",
            script_id,
            tenant_id,
        )
    return _row_to_reel(row) if row else None


async def delete_reel_script(tenant_id: UUID, script_id: UUID) -> bool:
    async with acquire() as conn:
        result = await conn.execute(
            "DELETE FROM reel_scripts WHERE id = $1 AND tenant_id = $2",
            script_id,
            tenant_id,
        )
    return result != "DELETE 0"
