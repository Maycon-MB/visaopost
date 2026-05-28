"""Tipos de domínio para posts gerados.

PostCopy = texto retornado pelo Gemini (caption/hashtags/cta).
Post     = representação imutável de uma linha da tabela `posts`.
"""

from __future__ import annotations

import re
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

_HASHTAG_RE = re.compile(r"^[a-z0-9_]{2,30}$")
_MAX_CAPTION = 2200  # limite hard Instagram
_MAX_CTA = 80
_MIN_HASHTAGS = 5
_MAX_HASHTAGS = 15


class PostCopy(BaseModel):
    """Texto gerado pelo Gemini. Persiste em posts.caption + posts.hashtags + metadata.cta."""

    model_config = ConfigDict(frozen=True)

    caption: str = Field(min_length=20, max_length=_MAX_CAPTION)
    hashtags: list[str] = Field(min_length=_MIN_HASHTAGS, max_length=_MAX_HASHTAGS)
    cta: str = Field(min_length=3, max_length=_MAX_CTA)

    @field_validator("hashtags")
    @classmethod
    def _normalize_hashtags(cls, tags: list[str]) -> list[str]:
        cleaned: list[str] = []
        seen: set[str] = set()
        for raw in tags:
            v = raw.strip().lstrip("#").lower()
            if not _HASHTAG_RE.match(v):
                raise ValueError(f"hashtag inválida: {raw!r} (esperado [a-z0-9_]{{2,30}})")
            if v in seen:
                raise ValueError(f"hashtag duplicada: {v!r}")
            seen.add(v)
            cleaned.append(v)
        return cleaned

    @field_validator("caption", "cta")
    @classmethod
    def _strip_non_empty(cls, value: str) -> str:
        v = value.strip()
        if not v:
            raise ValueError("texto não pode ser vazio")
        return v


class Post(BaseModel):
    """Linha da tabela `posts` após persistência."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    tenant_id: UUID
    scheduled_at: datetime
    status: str
    image_url: str | None
    caption: str
    hashtags: list[str]
    cta: str
    theme: str
    mood: str | None
    holiday_name: str | None
    created_at: datetime
