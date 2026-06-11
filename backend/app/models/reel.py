"""Modelos Pydantic para Scripts de Reels de Autoridade."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class ReelTom(str, Enum):
    autoridade = "autoridade"
    educativo = "educativo"
    promo = "promo"


class ReelScriptCreate(BaseModel):
    tema: str = Field(..., min_length=3, max_length=200)
    produto: str | None = Field(None, max_length=200)
    duracao_s: Literal[15, 30, 60] = 30
    tom: ReelTom = ReelTom.autoridade


class ReelScriptOutput(BaseModel):
    """Saída gerada pelo Gemini — campos validados antes de gravar no banco."""
    hook: str = Field(..., min_length=5)
    roteiro: str = Field(..., min_length=10)
    legenda: str = Field(..., min_length=10)
    hashtags: list[str] = Field(..., min_length=5, max_length=15)
    cta_verbal: str = Field(..., min_length=3)
    cta_legenda: str = Field(..., min_length=3)


class ReelScript(BaseModel):
    """Registro completo gravado no banco."""
    id: UUID
    tenant_id: UUID
    tema: str
    produto: str | None
    duracao_s: int
    tom: ReelTom
    hook: str
    roteiro: str
    legenda: str
    hashtags: list[str]
    cta_verbal: str
    cta_legenda: str
    created_at: datetime
