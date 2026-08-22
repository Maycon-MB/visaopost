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


class InvalidOAuthState(Exception):
    """State do OAuth Instagram inválido, expirado, ou malformado."""


def sign_oauth_state(*, tenant_id: UUID, ttl_minutes: int = 10) -> str:
    """State do redirect OAuth — carrega qual tenant iniciou o fluxo.

    TTL curto: o usuário faz login no Facebook e volta em segundos/poucos
    minutos, não faz sentido um state valer por horas.
    """
    settings = get_settings()
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "tenant_id": str(tenant_id),
        "type": "oauth_state",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=ttl_minutes)).timestamp()),
    }
    token: str = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token


def verify_oauth_state(state: str) -> UUID:
    """Decodifica o state do callback OAuth. Levanta `InvalidOAuthState` se inválido."""
    settings = get_settings()
    try:
        payload: dict[str, Any] = jwt.decode(state, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise InvalidOAuthState(f"state inválido ou expirado: {exc}") from exc
    if payload.get("type") != "oauth_state":
        raise InvalidOAuthState(f"tipo de state errado: {payload.get('type')!r}")
    try:
        return UUID(payload["tenant_id"])
    except (KeyError, ValueError) as exc:
        raise InvalidOAuthState("claim tenant_id ausente ou inválida") from exc


def sign_page_selection(*, tenant_id: UUID, pages: list[dict[str, Any]], ttl_minutes: int = 10) -> str:
    """Carrega a lista de Pages candidatas quando o cliente tem mais de uma.

    Vai e volta do frontend só pra guardar estado entre "usuário escolheu" e
    "backend confirma qual token salvar" — não persiste no DB, é descartável.
    """
    settings = get_settings()
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "tenant_id": str(tenant_id),
        "pages": pages,
        "type": "page_selection",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=ttl_minutes)).timestamp()),
    }
    token: str = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token


def verify_page_selection(token: str, *, tenant_id: UUID) -> list[dict[str, Any]]:
    """Decodifica o token de seleção e confere que pertence ao tenant autenticado."""
    settings = get_settings()
    try:
        payload: dict[str, Any] = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise InvalidOAuthState(f"seleção inválida ou expirada: {exc}") from exc
    if payload.get("type") != "page_selection":
        raise InvalidOAuthState(f"tipo de token errado: {payload.get('type')!r}")
    if payload.get("tenant_id") != str(tenant_id):
        raise InvalidOAuthState("seleção não pertence a este tenant")
    pages = payload.get("pages")
    if not isinstance(pages, list):
        raise InvalidOAuthState("claim pages ausente ou inválida")
    return pages
