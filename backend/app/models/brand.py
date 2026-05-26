"""Tipos compartilhados pra brand kit e contexto de tema.

Centraliza shape de dados que circula entre repositories, services e api.
"""

from __future__ import annotations

import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

HEX_COLOR_RE = re.compile(r"^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$")


class BrandColors(BaseModel):
    """Paleta hex obrigatória pra cada tenant. Valida formato no boot."""

    model_config = ConfigDict(extra="allow", frozen=True)

    primary: str = Field(description="Cor primária, fundo dominante")
    secondary: str = Field(description="Cor secundária / accent decorativo")
    accent: str = Field(default="#FFFFFF", description="Detalhes sutis")
    text: str = Field(default="#1A1A1A")
    background: str = Field(default="#FFFFFF")

    @field_validator("primary", "secondary", "accent", "text", "background")
    @classmethod
    def _validate_hex(cls, value: str) -> str:
        if not HEX_COLOR_RE.match(value):
            raise ValueError(f"hex inválido: {value!r} (esperado #RGB ou #RRGGBB)")
        return value.upper()


class BrandKit(BaseModel):
    """Tudo que serviço de IA precisa pra gerar conteúdo do tenant."""

    model_config = ConfigDict(frozen=True)

    business_name: str
    instagram_handle: str | None = None
    brand_voice: str = ""
    colors: BrandColors


class ThemeContext(BaseModel):
    """Contexto de um post específico: tema, mood, feriado opcional."""

    model_config = ConfigDict(frozen=True)

    theme: str
    mood: str | None = None
    holiday_name: str | None = None
    product_image_data_uri: str | None = None

    @field_validator("theme")
    @classmethod
    def _theme_not_empty(cls, value: str) -> str:
        v = value.strip()
        if not v:
            raise ValueError("theme não pode ser vazio")
        return v


class Holiday(BaseModel):
    """Linha da tabela holidays_br."""

    model_config = ConfigDict(frozen=True)

    name: str
    theme: str
    mood: str | None = None
    category: str | None = None
