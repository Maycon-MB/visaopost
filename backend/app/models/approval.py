"""Modelos do fluxo de aprovação de post via magic link.

Token JWT 24h leva o dono direto à tela `/aprovar/:token`. Sem login, sem senha.
Payload mínimo, claims padrão JWT.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ApprovalTokenPayload(BaseModel):
    """Claims dentro do JWT magic link."""

    model_config = ConfigDict(frozen=True)

    post_id: UUID
    tenant_id: UUID
    type: Literal["approval"] = "approval"
    exp: int  # epoch seconds (JWT padrão)
    iat: int


class ApprovalAction(BaseModel):
    """Body comum dos endpoints approve/reject/regenerate.

    `feedback` é opcional em approve/reject, obrigatório quando `action == 'regenerate'`
    (cliente disse o que mudar). Quem rejeita pode também escrever motivo.
    """

    model_config = ConfigDict(frozen=True)

    action: Literal["approve", "reject", "regenerate"]
    feedback: str | None = Field(default=None, max_length=500)

    @field_validator("feedback")
    @classmethod
    def _strip(cls, v: str | None) -> str | None:
        if v is None:
            return None
        s = v.strip()
        return s or None


class PostApprovalView(BaseModel):
    """Snapshot leve do post pra renderizar na tela `/aprovar/:token`.

    Sem ai_html nem ai_prompt — payload enxuto pra mobile. Imagem por URL.
    """

    model_config = ConfigDict(frozen=True)

    post_id: UUID
    tenant_id: UUID
    tenant_slug: str
    tenant_business_name: str
    scheduled_at: datetime
    status: str
    image_url: str | None
    caption: str
    hashtags: list[str]
    cta: str
    theme: str
    mood: str | None
    holiday_name: str | None
    approval_feedback: str | None
    regenerate_count: int
    approved_at: datetime | None
    rejection_reason: str | None
