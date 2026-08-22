"""Modelo Pydantic pra linha da view `post_features` (Fase 10k)."""

from __future__ import annotations

from datetime import date
from uuid import UUID

from pydantic import BaseModel


class PostFeatureRow(BaseModel):
    post_id: UUID
    tenant_id: UUID
    theme: str | None
    mood: str | None
    day_of_week: int
    hour_of_day: int
    is_holiday: bool
    caption_length: int
    hashtag_count: int
    reach: int
    impressions: int
    likes: int
    comments: int
    saves: int
    shares: int
    snapshot_date: date
    days_since_post: int
