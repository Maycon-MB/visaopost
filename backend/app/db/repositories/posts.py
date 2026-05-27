"""Queries da tabela `posts`. Insert tipado, retorna `Post` Pydantic.

CTA e holiday_name não têm colunas dedicadas — persistem em `metadata` jsonb.
"""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any
from uuid import UUID

from app.db.pool import acquire
from app.models.post import Post

_ALLOWED_STATUS = {"draft", "pending_approval", "approved", "rejected", "posted", "failed"}


async def create_post(
    *,
    tenant_id: UUID,
    scheduled_at: datetime,
    theme: str,
    caption: str,
    hashtags: list[str],
    cta: str,
    status: str = "draft",
    mood: str | None = None,
    holiday_name: str | None = None,
    image_url: str | None = None,
    ai_html: str | None = None,
    ai_prompt: dict[str, Any] | None = None,
) -> Post:
    """Insere linha em `posts` e devolve representação imutável."""
    if status not in _ALLOWED_STATUS:
        raise ValueError(f"status inválido: {status!r}")

    metadata: dict[str, Any] = {"cta": cta}
    if holiday_name:
        metadata["holiday_name"] = holiday_name

    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO posts (
                tenant_id, scheduled_at, status,
                image_url, caption, hashtags,
                theme, mood,
                ai_prompt, ai_html, metadata
            )
            VALUES (
                $1, $2, $3,
                $4, $5, $6,
                $7, $8,
                $9::jsonb, $10, $11::jsonb
            )
            RETURNING id, tenant_id, scheduled_at, status,
                      image_url, caption, hashtags, theme, mood,
                      metadata, created_at
            """,
            tenant_id,
            scheduled_at,
            status,
            image_url,
            caption,
            hashtags,
            theme,
            mood,
            json.dumps(ai_prompt or {}),
            ai_html,
            json.dumps(metadata),
        )

    return Post(
        id=row["id"],
        tenant_id=row["tenant_id"],
        scheduled_at=row["scheduled_at"],
        status=row["status"],
        image_url=row["image_url"],
        caption=row["caption"],
        hashtags=list(row["hashtags"]),
        cta=cta,
        theme=row["theme"],
        mood=row["mood"],
        holiday_name=holiday_name,
        created_at=row["created_at"],
    )
