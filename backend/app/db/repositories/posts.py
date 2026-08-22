"""Queries da tabela `posts`. Insert tipado, retorna `Post` Pydantic.

CTA e holiday_name não têm colunas dedicadas — persistem em `metadata` jsonb.
"""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any
from uuid import UUID

import asyncpg
from pydantic import BaseModel

from app.db.pool import acquire
from app.models.approval import PostApprovalView
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


def _row_metadata(row: asyncpg.Record) -> dict[str, Any]:
    raw = row["metadata"]
    if isinstance(raw, str):
        return dict(json.loads(raw))
    if isinstance(raw, dict):
        return dict(raw)
    return {}


async def attach_approval_token(post_id: UUID, token: str) -> None:
    """Persiste o JWT magic link no `posts.approval_token`. Idempotente."""
    async with acquire() as conn:
        await conn.execute(
            "UPDATE posts SET approval_token = $1, status = 'pending_approval' WHERE id = $2",
            token,
            post_id,
        )


async def get_approval_view(post_id: UUID) -> PostApprovalView | None:
    """Junta posts + tenants pra montar tela `/aprovar/:token` sem N+1."""
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT p.id, p.tenant_id, p.scheduled_at, p.status, p.image_url,
                   p.caption, p.hashtags, p.theme, p.mood, p.metadata,
                   p.approval_feedback, p.regenerate_count, p.approved_at,
                   p.rejection_reason,
                   t.slug AS tenant_slug, t.business_name AS tenant_business_name
            FROM posts p
            JOIN tenants t ON t.id = p.tenant_id
            WHERE p.id = $1
            """,
            post_id,
        )
    if row is None:
        return None
    metadata = _row_metadata(row)
    return PostApprovalView(
        post_id=row["id"],
        tenant_id=row["tenant_id"],
        tenant_slug=row["tenant_slug"],
        tenant_business_name=row["tenant_business_name"],
        scheduled_at=row["scheduled_at"],
        status=row["status"],
        image_url=row["image_url"],
        caption=row["caption"],
        hashtags=list(row["hashtags"]),
        cta=str(metadata.get("cta", "")),
        theme=row["theme"],
        mood=row["mood"],
        holiday_name=metadata.get("holiday_name"),
        approval_feedback=row["approval_feedback"],
        regenerate_count=int(row["regenerate_count"] or 0),
        approved_at=row["approved_at"],
        rejection_reason=row["rejection_reason"],
    )


async def mark_approved(post_id: UUID, *, when: datetime | None = None) -> bool:
    """Atualiza status='approved' + approved_at. Idempotente — re-aprovar não muda nada."""
    timestamp = when or datetime.now()
    async with acquire() as conn:
        status: str = await conn.execute(
            """
            UPDATE posts
            SET status = 'approved', approved_at = $1
            WHERE id = $2 AND status IN ('pending_approval','draft')
            """,
            timestamp,
            post_id,
        )
    return status == "UPDATE 1"


async def mark_rejected(post_id: UUID, *, reason: str | None) -> bool:
    """Marca como rejected + persiste motivo opcional. Não re-rejeita se já rejected."""
    async with acquire() as conn:
        status: str = await conn.execute(
            """
            UPDATE posts
            SET status = 'rejected', rejection_reason = $1
            WHERE id = $2 AND status IN ('pending_approval','draft')
            """,
            reason,
            post_id,
        )
    return status == "UPDATE 1"


async def mark_as_posted(post_id: UUID, *, instagram_post_id: str, when: datetime | None = None) -> bool:
    """Atualiza status='posted' + instagram_post_id + posted_at."""
    timestamp = when or datetime.now()
    async with acquire() as conn:
        status: str = await conn.execute(
            """
            UPDATE posts
            SET status = 'posted', instagram_post_id = $1, posted_at = $2
            WHERE id = $3 AND status = 'approved'
            """,
            instagram_post_id,
            timestamp,
            post_id,
        )
    return status == "UPDATE 1"


class PublicPost(BaseModel):
    id: UUID
    scheduled_at: datetime
    status: str
    image_url: str | None
    caption: str
    hashtags: list[str]
    theme: str
    approved_at: datetime | None


async def list_public_posts(tenant_slug: str, *, limit: int = 30) -> list[PublicPost]:
    """Posts aprovados/publicados de um tenant, para galeria pública. Sem dados sensíveis."""
    async with acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT p.id, p.scheduled_at, p.status, p.image_url,
                   p.caption, p.hashtags, p.theme, p.approved_at
            FROM posts p
            JOIN tenants t ON t.id = p.tenant_id
            WHERE t.slug = $1
              AND t.is_active = true
              AND p.status IN ('approved', 'posted')
              AND p.image_url IS NOT NULL
            ORDER BY p.scheduled_at DESC
            LIMIT $2
            """,
            tenant_slug,
            limit,
        )
    return [
        PublicPost(
            id=row["id"],
            scheduled_at=row["scheduled_at"],
            status=row["status"],
            image_url=row["image_url"],
            caption=row["caption"],
            hashtags=list(row["hashtags"]),
            theme=row["theme"],
            approved_at=row["approved_at"],
        )
        for row in rows
    ]


async def request_regenerate(post_id: UUID, *, feedback: str | None) -> bool:
    """Marca pra regerar: status='draft', feedback persistido, contador +1.

    Worker RQ vê draft + regenerate_count>0 e dispara nova geração consumindo
    `approval_feedback` como prompt extra pro Gemini.
    """
    async with acquire() as conn:
        status: str = await conn.execute(
            """
            UPDATE posts
            SET status = 'draft',
                approval_feedback = $1,
                regenerate_count = regenerate_count + 1,
                approval_token = NULL
            WHERE id = $2 AND status IN ('pending_approval','rejected')
            """,
            feedback,
            post_id,
        )
    return status == "UPDATE 1"


class ApprovedPost(BaseModel):
    id: UUID
    tenant_id: UUID
    tenant_slug: str
    instagram_access_token: str | None
    instagram_business_account_id: str | None
    image_url: str | None
    caption: str
    hashtags: list[str]
    scheduled_at: datetime


async def list_approved_due(*, limit: int = 20) -> list[ApprovedPost]:
    """Posts aprovados cujo scheduled_at já passou. Candidatos pra publicar no IG."""
    async with acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT p.id, p.tenant_id, p.image_url, p.caption, p.hashtags, p.scheduled_at,
                   t.slug AS tenant_slug,
                   t.instagram_access_token,
                   t.instagram_business_account_id
            FROM posts p
            JOIN tenants t ON t.id = p.tenant_id
            WHERE p.status = 'approved'
              AND p.scheduled_at <= now()
              AND t.is_active = true
            ORDER BY p.scheduled_at ASC
            LIMIT $1
            """,
            limit,
        )
    return [
        ApprovedPost(
            id=row["id"],
            tenant_id=row["tenant_id"],
            tenant_slug=row["tenant_slug"],
            instagram_access_token=row["instagram_access_token"],
            instagram_business_account_id=row["instagram_business_account_id"],
            image_url=row["image_url"],
            caption=row["caption"],
            hashtags=list(row["hashtags"]),
            scheduled_at=row["scheduled_at"],
        )
        for row in rows
    ]


async def upsert_instagram_metrics(
    *,
    tenant_id: UUID,
    post_id: UUID,
    reach: int,
    impressions: int,
    likes: int,
    comments: int,
    saves: int,
    shares: int,
) -> None:
    """Insere ou atualiza snapshot de métricas do dia em metrics_instagram."""
    async with acquire() as conn:
        await conn.execute(
            """
            INSERT INTO metrics_instagram
                (tenant_id, post_id, snapshot_date, reach, impressions, likes, comments, saves, shares)
            VALUES ($1, $2, current_date, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (post_id, snapshot_date)
            DO UPDATE SET
                reach = EXCLUDED.reach,
                impressions = EXCLUDED.impressions,
                likes = EXCLUDED.likes,
                comments = EXCLUDED.comments,
                saves = EXCLUDED.saves,
                shares = EXCLUDED.shares,
                captured_at = now()
            """,
            tenant_id,
            post_id,
            reach,
            impressions,
            likes,
            comments,
            saves,
            shares,
        )
