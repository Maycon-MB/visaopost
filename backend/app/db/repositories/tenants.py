"""Queries da tabela `tenants`. Retorna tipos Pydantic, nunca asyncpg.Record cru."""

from __future__ import annotations

import json
from uuid import UUID

from app.db.pool import acquire
from app.models.brand import BrandColors, BrandKit
from app.models.settings import TenantSettings, TenantSettingsUpdate


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


def _coerce_weekdays(raw: object) -> list[int]:
    """jsonb pode vir como list[int] ou string JSON. Normaliza pra list[int]."""
    if isinstance(raw, str):
        parsed = json.loads(raw)
    elif isinstance(raw, list):
        parsed = raw
    elif raw is None:
        return [1, 2, 3, 4, 5, 6]
    else:
        raise TypeError(f"active_weekdays tipo inesperado: {type(raw).__name__}")
    return [int(x) for x in parsed]


async def get_tenant_settings(slug: str) -> TenantSettings | None:
    """Retorna settings do tenant ativo. None se slug inexistente/inativo."""
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT send_hour, publish_hour, active_weekdays, extra_instructions,
                   owner_email, timezone
            FROM tenants
            WHERE slug = $1 AND is_active = true
            """,
            slug,
        )
    if row is None:
        return None
    return TenantSettings(
        send_hour=row["send_hour"],
        publish_hour=row["publish_hour"],
        active_weekdays=_coerce_weekdays(row["active_weekdays"]),
        extra_instructions=row["extra_instructions"],
        owner_email=row["owner_email"],
        timezone=row["timezone"],
    )


async def update_tenant_settings(
    slug: str,
    patch: TenantSettingsUpdate,
) -> TenantSettings | None:
    """Aplica patch nos campos não-None. Retorna snapshot atualizado.

    None se slug inexistente/inativo. Patch vazio = no-op, devolve estado atual.
    """
    sets: list[str] = []
    values: list[object] = []
    idx = 1

    if patch.send_hour is not None:
        sets.append(f"send_hour = ${idx}")
        values.append(patch.send_hour)
        idx += 1
    if patch.publish_hour is not None:
        sets.append(f"publish_hour = ${idx}")
        values.append(patch.publish_hour)
        idx += 1
    if patch.active_weekdays is not None:
        sets.append(f"active_weekdays = ${idx}::jsonb")
        values.append(json.dumps(patch.active_weekdays))
        idx += 1
    if patch.extra_instructions is not None:
        sets.append(f"extra_instructions = ${idx}")
        values.append(patch.extra_instructions)
        idx += 1
    if patch.owner_email is not None:
        sets.append(f"owner_email = ${idx}")
        values.append(patch.owner_email)
        idx += 1

    if not sets:
        return await get_tenant_settings(slug)

    values.append(slug)
    sql = f"""
        UPDATE tenants
        SET {", ".join(sets)}
        WHERE slug = ${idx} AND is_active = true
        RETURNING send_hour, publish_hour, active_weekdays, extra_instructions,
                  owner_email, timezone
    """

    async with acquire() as conn:
        row = await conn.fetchrow(sql, *values)

    if row is None:
        return None

    return TenantSettings(
        send_hour=row["send_hour"],
        publish_hour=row["publish_hour"],
        active_weekdays=_coerce_weekdays(row["active_weekdays"]),
        extra_instructions=row["extra_instructions"],
        owner_email=row["owner_email"],
        timezone=row["timezone"],
    )
