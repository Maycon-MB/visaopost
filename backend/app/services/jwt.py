"""Magic link JWT pra aprovação do post via email.

Assinatura HS256 com `JWT_SECRET`. TTL 24h por padrão (configurável).

Não tem refresh, não tem revoke. Token expirado = email novo. Caso de uso:
"abrir o link do email e clicar aprovar". Cheap and stateless.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import UUID

from jose import JWTError, jwt

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)


class InvalidApprovalToken(Exception):
    """Token assinatura inválida, expirado, malformado, ou tipo errado."""


def sign_approval_token(
    *,
    post_id: UUID,
    tenant_id: UUID,
    ttl_hours: int | None = None,
) -> str:
    """Gera magic link JWT pro post. Default TTL = `JWT_EXPIRES_HOURS` do .env."""
    settings = get_settings()
    hours = ttl_hours if ttl_hours is not None else settings.jwt_expires_hours
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "post_id": str(post_id),
        "tenant_id": str(tenant_id),
        "type": "approval",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=hours)).timestamp()),
    }
    token: str = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    logger.info(
        "jwt.approval_signed",
        post_id=str(post_id),
        tenant_id=str(tenant_id),
        ttl_hours=hours,
    )
    return token


def verify_approval_token(token: str) -> dict[str, Any]:
    """Decodifica JWT e devolve payload bruto. Levanta `InvalidApprovalToken` se inválido."""
    settings = get_settings()
    try:
        payload: dict[str, Any] = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError as exc:
        raise InvalidApprovalToken(f"token inválido ou expirado: {exc}") from exc

    if payload.get("type") != "approval":
        raise InvalidApprovalToken(f"tipo de token errado: {payload.get('type')!r}")

    for required in ("post_id", "tenant_id"):
        if required not in payload:
            raise InvalidApprovalToken(f"claim ausente: {required!r}")

    return payload
