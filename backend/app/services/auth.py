"""Autenticação do painel do dono: hash de senha (bcrypt), token de sessão (JWT)
e tokens de redefinição de senha (aleatório, guardado só como hash).

Sem passlib (incompatível com bcrypt 5.x) — usa a lib `bcrypt` direto.
"""

from __future__ import annotations

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import UUID

import bcrypt
from jose import JWTError, jwt

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)

# bcrypt trunca em 72 bytes; limitamos a senha na validação do payload.
_MAX_PASSWORD_BYTES = 72


class InvalidSessionToken(Exception):
    """Token de sessão inválido, expirado ou de tipo errado."""


def hash_password(password: str) -> str:
    pw = password.encode("utf-8")[:_MAX_PASSWORD_BYTES]
    return bcrypt.hashpw(pw, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    pw = password.encode("utf-8")[:_MAX_PASSWORD_BYTES]
    try:
        return bcrypt.checkpw(pw, password_hash.encode("utf-8"))
    except ValueError:
        return False


def sign_session_token(*, user_id: UUID, tenant_id: UUID, role: str) -> str:
    """Gera o JWT de sessão do painel. Stateless, expira em `session_expires_hours`."""
    settings = get_settings()
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "tenant_id": str(tenant_id),
        "role": role,
        "type": "session",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=settings.session_expires_hours)).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def verify_session_token(token: str) -> dict[str, Any]:
    """Decodifica o JWT de sessão. Levanta `InvalidSessionToken` se inválido."""
    settings = get_settings()
    try:
        payload: dict[str, Any] = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
    except JWTError as exc:
        raise InvalidSessionToken(f"sessão inválida ou expirada: {exc}") from exc
    if payload.get("type") != "session":
        raise InvalidSessionToken("tipo de token errado")
    for claim in ("sub", "tenant_id", "role"):
        if claim not in payload:
            raise InvalidSessionToken(f"claim ausente: {claim!r}")
    return payload


def generate_reset_token() -> tuple[str, str, datetime]:
    """Gera (token_cru, token_hash, expira_em). O cru vai no email; o hash, no banco."""
    settings = get_settings()
    raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.reset_expires_minutes)
    return raw, token_hash, expires_at


def hash_reset_token(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()
