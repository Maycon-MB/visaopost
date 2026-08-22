"""Queries da tabela `tenants`. Retorna tipos Pydantic, nunca asyncpg.Record cru."""

from __future__ import annotations

import json
from datetime import datetime
from uuid import UUID

import asyncpg

from app.db.pool import acquire
from app.models.brand import BrandColors, BrandKit
from app.models.instagram_oauth import InstagramConnectionStatus
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


async def get_tenant_access(tenant_id: UUID) -> tuple[bool, str, str] | None:
    """(is_active, subscription_status, business_name) pra checar acesso no login.

    None se o tenant não existe. Login bloqueia se inativo ou assinatura
    suspensa/cancelada (inadimplência/cancelamento de contrato).
    """
    async with acquire() as conn:
        row = await conn.fetchrow(
            "SELECT is_active, subscription_status, business_name FROM tenants WHERE id = $1",
            tenant_id,
        )
    if row is None:
        return None
    return row["is_active"], row["subscription_status"], row["business_name"]


async def save_instagram_connection(
    tenant_id: UUID,
    *,
    access_token: str,
    business_account_id: str,
    page_name: str,
    expires_at: datetime,
) -> None:
    """Persiste a conexão Instagram escolhida no fluxo OAuth (Facebook Login for Business)."""
    async with acquire() as conn:
        await conn.execute(
            """
            UPDATE tenants
            SET instagram_access_token = $1,
                instagram_business_account_id = $2,
                facebook_page_name = $3,
                instagram_token_expires_at = $4
            WHERE id = $5
            """,
            access_token,
            business_account_id,
            page_name,
            expires_at,
            tenant_id,
        )


async def get_instagram_connection_status(tenant_id: UUID) -> InstagramConnectionStatus:
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT instagram_business_account_id, facebook_page_name, instagram_token_expires_at
            FROM tenants
            WHERE id = $1
            """,
            tenant_id,
        )
    if row is None or not row["instagram_business_account_id"]:
        return InstagramConnectionStatus(connected=False)

    expires_at = row["instagram_token_expires_at"]
    days_left = (expires_at - datetime.now(expires_at.tzinfo)).days if expires_at else None
    return InstagramConnectionStatus(
        connected=True,
        page_name=row["facebook_page_name"],
        instagram_business_account_id=row["instagram_business_account_id"],
        expires_at=expires_at,
        days_until_expiry=days_left,
    )


async def get_instagram_credentials(tenant_id: UUID) -> tuple[str, str] | None:
    """(access_token, business_account_id) do tenant, pra publicar/testar. None se não conectado."""
    async with acquire() as conn:
        row = await conn.fetchrow(
            "SELECT instagram_access_token, instagram_business_account_id FROM tenants WHERE id = $1",
            tenant_id,
        )
    if row is None or not row["instagram_access_token"] or not row["instagram_business_account_id"]:
        return None
    return row["instagram_access_token"], row["instagram_business_account_id"]


async def list_tenants_with_expiring_instagram_token(within_days: int = 7) -> list[dict[str, object]]:
    """Tenants ativos cujo token Instagram expira dentro de `within_days`.

    Job de aviso consome isso — não faz nada sozinho, só sinaliza (Fase 10g
    ainda vai decidir o canal de alerta pro Maycon: WhatsApp, email, etc).
    """
    async with acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, slug, business_name, instagram_token_expires_at
            FROM tenants
            WHERE is_active = true
              AND instagram_token_expires_at IS NOT NULL
              AND instagram_token_expires_at <= now() + ($1 || ' days')::interval
            """,
            within_days,
        )
    return [dict(row) for row in rows]


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


_SETTINGS_COLS = (
    "send_hour, publish_hour, active_weekdays, extra_instructions, "
    "whatsapp_faq, owner_email, timezone"
)


def _row_to_settings(row: asyncpg.Record) -> TenantSettings:
    return TenantSettings(
        send_hour=row["send_hour"],
        publish_hour=row["publish_hour"],
        active_weekdays=_coerce_weekdays(row["active_weekdays"]),
        extra_instructions=row["extra_instructions"],
        whatsapp_faq=row["whatsapp_faq"],
        owner_email=row["owner_email"],
        timezone=row["timezone"],
    )


async def get_tenant_settings(tenant_id: UUID) -> TenantSettings | None:
    """Retorna settings do tenant ativo. None se inexistente/inativo."""
    async with acquire() as conn:
        row = await conn.fetchrow(
            f"SELECT {_SETTINGS_COLS} FROM tenants WHERE id = $1 AND is_active = true",
            tenant_id,
        )
    return None if row is None else _row_to_settings(row)


async def update_tenant_settings(
    tenant_id: UUID,
    patch: TenantSettingsUpdate,
) -> TenantSettings | None:
    """Aplica patch nos campos não-None. Retorna snapshot atualizado.

    None se tenant inexistente/inativo. Patch vazio = no-op, devolve estado atual.
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
    if patch.whatsapp_faq is not None:
        sets.append(f"whatsapp_faq = ${idx}")
        values.append(patch.whatsapp_faq)
        idx += 1
    if patch.owner_email is not None:
        sets.append(f"owner_email = ${idx}")
        values.append(patch.owner_email)
        idx += 1

    if not sets:
        return await get_tenant_settings(tenant_id)

    values.append(tenant_id)
    sql = f"""
        UPDATE tenants
        SET {", ".join(sets)}
        WHERE id = ${idx} AND is_active = true
        RETURNING {_SETTINGS_COLS}
    """

    async with acquire() as conn:
        row = await conn.fetchrow(sql, *values)

    return None if row is None else _row_to_settings(row)
