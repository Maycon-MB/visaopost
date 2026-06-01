"""Tipos de `admin_users` (quem loga no painel) + payloads de auth."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

_VALID_ROLES = {"owner", "staff"}


class AdminUser(BaseModel):
    """Linha de `admin_users` (sem o hash da senha)."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    tenant_id: UUID
    name: str
    phone: str | None = None
    email: str
    role: str
    status: str
    last_login_at: datetime | None
    created_at: datetime


class ProfileUpdate(BaseModel):
    """Payload PATCH parcial do perfil do usuário logado."""

    model_config = ConfigDict(frozen=True)

    name: str | None = Field(default=None, min_length=2, max_length=120)
    phone: str | None = Field(default=None, max_length=30)


class AdminUserWithHash(AdminUser):
    """Igual ao AdminUser + o hash — uso interno no login, nunca sai da API."""

    password_hash: str | None


class LoginRequest(BaseModel):
    model_config = ConfigDict(frozen=True)

    identifier: str = Field(min_length=1, max_length=160, description="Email ou nome de usuário")
    password: str = Field(min_length=1, max_length=200)

    @field_validator("identifier")
    @classmethod
    def _norm(cls, v: str) -> str:
        return v.strip().lower()


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUser


class ForgotPasswordRequest(BaseModel):
    model_config = ConfigDict(frozen=True)

    email: str = Field(min_length=3, max_length=160)

    @field_validator("email")
    @classmethod
    def _norm_email(cls, v: str) -> str:
        return v.strip().lower()


class ResetPasswordRequest(BaseModel):
    model_config = ConfigDict(frozen=True)

    token: str = Field(min_length=10, max_length=200)
    password: str = Field(min_length=8, max_length=72)


class InviteUserRequest(BaseModel):
    """Owner convida um membro da equipe."""

    model_config = ConfigDict(frozen=True)

    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=3, max_length=160)
    role: str = "staff"

    @field_validator("email")
    @classmethod
    def _norm_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("role")
    @classmethod
    def _valid_role(cls, v: str) -> str:
        if v not in _VALID_ROLES:
            raise ValueError(f"papel inválido: {v!r}")
        return v
