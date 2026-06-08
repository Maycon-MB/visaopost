"""Tipos da tabela `products` — catálogo de produtos da ótica."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

_VALID_CATEGORIES = {"Solar", "Grau", "Premium", "Lentes", "Acessórios", "Outros"}


class ProductCreate(BaseModel):
    model_config = ConfigDict(frozen=True)

    name: str = Field(min_length=1, max_length=120)
    category: str = Field(default="Outros", max_length=60)
    description: str | None = Field(default=None, max_length=500)
    price_brl: float | None = Field(default=None, ge=0)
    tags: list[str] = Field(default_factory=list)
    features: list[str] = Field(default_factory=list)
    position: int = Field(default=0, ge=0)
    is_active: bool = True


class ProductUpdate(BaseModel):
    model_config = ConfigDict(frozen=True)

    name: str | None = Field(default=None, min_length=1, max_length=120)
    category: str | None = Field(default=None, max_length=60)
    description: str | None = None
    price_brl: float | None = None
    tags: list[str] | None = None
    features: list[str] | None = None
    position: int | None = Field(default=None, ge=0)
    is_active: bool | None = None


class Product(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID
    tenant_id: UUID
    name: str
    category: str
    description: str | None
    price_brl: float | None
    image_url: str | None
    tags: list[str]
    features: list[str]
    position: int
    is_active: bool
    created_at: datetime
