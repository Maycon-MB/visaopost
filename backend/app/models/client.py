"""Tipos da tabela `clients` — base de clientes da ótica pra recall WhatsApp."""

from __future__ import annotations

import re
from datetime import date as DateType
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Aceita só dígitos depois de remover separadores. 10-13 dígitos cobre BR
# (DDD+9+8 com ou sem +55). Validação branda — onboarding é rude com restrição agressiva.
_PHONE_DIGITS = re.compile(r"\D+")
_VALID_STATUS = {"active", "opted_out", "converted"}


def _normalize_phone(raw: str) -> str:
    digits = _PHONE_DIGITS.sub("", raw)
    if not (10 <= len(digits) <= 13):
        raise ValueError(f"telefone com {len(digits)} dígitos; esperado 10-13 (DDD + número)")
    return digits


class ClientCreate(BaseModel):
    """Payload pra criar 1 cliente. Usado no POST /api/clients e no import CSV."""

    model_config = ConfigDict(frozen=True)

    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=10, max_length=20)
    email: str | None = Field(default=None, max_length=120)
    last_exam_date: DateType | None = None
    observations: str | None = Field(default=None, max_length=500)

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
        if v is not None and v > DateType.today():
            raise ValueError("data do exame não pode estar no futuro")
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
