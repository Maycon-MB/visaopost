"""Tipos da tabela `clients` — base de clientes da ótica pra recall WhatsApp."""

from __future__ import annotations

import re
from datetime import date as DateType
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class OlhoReceita(BaseModel):
    """Dados de refração de um olho (OD ou OE) pra uma distância."""

    model_config = ConfigDict(frozen=True)

    esferico: float | None = None    # ex: -2.50 ou +1.25
    cilindrico: float | None = None  # ex: -0.75
    eixo: int | None = None          # 0–180°
    dp: float | None = None          # distância pupilar mm
    altura: float | None = None      # altura mm


class ParReceita(BaseModel):
    """Par OD + OE pra uma distância (longe ou perto)."""

    model_config = ConfigDict(frozen=True)

    od: OlhoReceita = Field(default_factory=OlhoReceita)
    oe: OlhoReceita = Field(default_factory=OlhoReceita)


class Receita(BaseModel):
    """Receita ótica completa do cliente (grau longe + perto + produto)."""

    model_config = ConfigDict(frozen=True)

    longe: ParReceita = Field(default_factory=ParReceita)
    perto: ParReceita = Field(default_factory=ParReceita)
    lente: str | None = Field(default=None, max_length=100)
    armacao: str | None = Field(default=None, max_length=100)
    obs: str | None = Field(default=None, max_length=300)

# Aceita só dígitos depois de remover separadores. 10-13 dígitos cobre BR
# (DDD+9+8 com ou sem +55). Validação branda — onboarding é rude com restrição agressiva.
_PHONE_DIGITS = re.compile(r"\D+")
_VALID_STATUS = {"active", "opted_out", "converted"}
_VALID_SOURCE = {"manual", "csv", "qr_balcao", "indicacao", "instagram", "site"}


def _normalize_phone(raw: str) -> str:
    digits = _PHONE_DIGITS.sub("", raw)
    if not (10 <= len(digits) <= 13):
        raise ValueError(f"telefone com {len(digits)} dígitos; esperado 10-13 (DDD + número)")
    return digits


def _not_future(v: DateType | None, label: str) -> DateType | None:
    if v is not None and v > DateType.today():
        raise ValueError(f"{label} não pode estar no futuro")
    return v


class ClientCreate(BaseModel):
    """Payload pra criar 1 cliente. Usado no POST /api/clients e no import CSV."""

    model_config = ConfigDict(frozen=True)

    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=10, max_length=20)
    email: str | None = Field(default=None, max_length=120)
    last_exam_date: DateType | None = None
    observations: str | None = Field(default=None, max_length=500)

    # CRM (Fase 6c): dados que dão liga ao recall + personalização + LGPD.
    birth_date: DateType | None = None
    consent_whatsapp: bool = False
    source: str = "manual"
    health_plan: str | None = Field(default=None, max_length=80)
    lens_type: str | None = Field(default=None, max_length=60)
    frame_brand: str | None = Field(default=None, max_length=60)
    last_purchase_date: DateType | None = None
    last_purchase_value_brl: float | None = Field(default=None, ge=0)
    next_return_date: DateType | None = None
    neighborhood: str | None = Field(default=None, max_length=80)
    receita: Receita | None = None

    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("nome vazio")
        return s

    @field_validator("phone")
    @classmethod
    def _validate_phone(cls, v: str) -> str:
        return _normalize_phone(v)

    @field_validator("email")
    @classmethod
    def _validate_email(cls, v: str | None) -> str | None:
        if v is None or not v.strip():
            return None
        s = v.strip().lower()
        if "@" not in s or "." not in s.split("@")[-1]:
            raise ValueError("email inválido")
        return s

    @field_validator("last_exam_date")
    @classmethod
    def _exam_not_future(cls, v: DateType | None) -> DateType | None:
        return _not_future(v, "data do exame")

    @field_validator("birth_date")
    @classmethod
    def _birth_not_future(cls, v: DateType | None) -> DateType | None:
        return _not_future(v, "data de nascimento")

    @field_validator("last_purchase_date")
    @classmethod
    def _purchase_not_future(cls, v: DateType | None) -> DateType | None:
        return _not_future(v, "data da compra")

    @field_validator("source")
    @classmethod
    def _validate_source(cls, v: str) -> str:
        if v not in _VALID_SOURCE:
            raise ValueError(f"origem inválida: {v!r}")
        return v


class ClientUpdate(BaseModel):
    """Payload PATCH parcial. Todos os campos opcionais. None = não mexe."""

    model_config = ConfigDict(frozen=True)

    name: str | None = Field(default=None, min_length=2, max_length=120)
    phone: str | None = Field(default=None, min_length=10, max_length=20)
    email: str | None = Field(default=None, max_length=120)
    last_exam_date: DateType | None = None
    observations: str | None = Field(default=None, max_length=500)
    status: str | None = None

    birth_date: DateType | None = None
    consent_whatsapp: bool | None = None
    source: str | None = None
    health_plan: str | None = Field(default=None, max_length=80)
    lens_type: str | None = Field(default=None, max_length=60)
    frame_brand: str | None = Field(default=None, max_length=60)
    last_purchase_date: DateType | None = None
    last_purchase_value_brl: float | None = Field(default=None, ge=0)
    next_return_date: DateType | None = None
    neighborhood: str | None = Field(default=None, max_length=80)
    receita: Receita | None = None

    @field_validator("phone")
    @classmethod
    def _validate_phone(cls, v: str | None) -> str | None:
        return None if v is None else _normalize_phone(v)

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: str | None) -> str | None:
        if v is None:
            return None
        if v not in _VALID_STATUS:
            raise ValueError(f"status inválido: {v!r} (esperado um de {sorted(_VALID_STATUS)})")
        return v

    @field_validator("source")
    @classmethod
    def _validate_source(cls, v: str | None) -> str | None:
        if v is not None and v not in _VALID_SOURCE:
            raise ValueError(f"origem inválida: {v!r}")
        return v


class Client(BaseModel):
    """Linha da tabela `clients` após persistência."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    tenant_id: UUID
    name: str
    phone: str
    email: str | None
    last_exam_date: DateType | None
    last_contacted_at: datetime | None
    status: str
    observations: str | None
    created_at: datetime

    birth_date: DateType | None = None
    consent_whatsapp: bool = False
    consent_at: datetime | None = None
    source: str = "manual"
    health_plan: str | None = None
    lens_type: str | None = None
    frame_brand: str | None = None
    last_purchase_date: DateType | None = None
    last_purchase_value_brl: float | None = None
    next_return_date: DateType | None = None
    neighborhood: str | None = None
    receita: Receita | None = None
