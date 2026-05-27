"""Queries da tabela `tenants`. Retorna tipos Pydantic, nunca asyncpg.Record cru."""

from __future__ import annotations

import json
from uuid import UUID

from app.db.pool import acquire
from app.models.brand import BrandColors, BrandKit


def _coerce_colors(raw: object) -> dict[str, str]:
    """asyncpg pode devolver jsonb como dict ou str dependendo do codec."""
    if isinstance(raw, str):
        parsed = json.loads(raw)
    elif isinstance(raw, dict):
        parsed = raw
    elif raw is None:
        parsed = {}
    else:
        raise TypeError(f"brand_colors tipo inesperado: {type(raw).__name__}")
    return {str(k): str(v) for k, v in parsed.items()}


async def get_brand_kit(slug: str) -> BrandKit | None:
    """Carrega tenant ativo + valida brand colors via Pydantic.

    Retorna None se tenant não existe ou inativo.
    Levanta ValueError se brand_colors do DB estiver malformada.
    """
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT business_name, instagram_handle, brand_colors, brand_voice
            FROM tenants
            WHERE slug = $1 AND is_active = true
            """,
            slug,
        )
    if row is None:
        return None

    colors = BrandColors.model_validate(_coerce_colors(row["brand_colors"]))
    return BrandKit(
        business_name=row["business_name"],
        instagram_handle=row["instagram_handle"],
        brand_voice=row["brand_voice"] or "",
        colors=colors,
    )


async def get_tenant_id_by_slug(slug: str) -> UUID | None:
    """Resolve slug → UUID do tenant ativo. None se não existe ou inativo."""
    async with acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id FROM tenants WHERE slug = $1 AND is_active = true",
            slug,
        )
    return row["id"] if row else None
