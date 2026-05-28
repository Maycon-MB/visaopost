"""Testa sign_approval_token / verify_approval_token sem rede.

Cobertura: roundtrip, expirado, secret diferente, tipo errado, claims faltando.
Não exercita Resend nem Postgres.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from unittest.mock import patch
from uuid import uuid4

import pytest
from jose import jwt

from app.config import get_settings
from app.services.jwt import (
    InvalidApprovalToken,
    sign_approval_token,
    verify_approval_token,
)


def test_sign_e_verify_roundtrip() -> None:
    post_id = uuid4()
    tenant_id = uuid4()
    token = sign_approval_token(post_id=post_id, tenant_id=tenant_id, ttl_hours=1)
    payload = verify_approval_token(token)
    assert payload["post_id"] == str(post_id)
    assert payload["tenant_id"] == str(tenant_id)
    assert payload["type"] == "approval"
    assert payload["exp"] > payload["iat"]


def test_verify_rejeita_token_expirado() -> None:
    settings = get_settings()
    expired_iat = int((datetime.now(UTC) - timedelta(hours=48)).timestamp())
    expired_exp = int((datetime.now(UTC) - timedelta(hours=24)).timestamp())
    payload = {
        "post_id": str(uuid4()),
        "tenant_id": str(uuid4()),
        "type": "approval",
        "iat": expired_iat,
        "exp": expired_exp,
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    with pytest.raises(InvalidApprovalToken, match="expirado|inválido"):
        verify_approval_token(token)


def test_verify_rejeita_assinatura_invalida() -> None:
    settings = get_settings()
    bad_token = jwt.encode(
        {
            "post_id": str(uuid4()),
            "tenant_id": str(uuid4()),
            "type": "approval",
            "iat": int(datetime.now(UTC).timestamp()),
            "exp": int((datetime.now(UTC) + timedelta(hours=1)).timestamp()),
        },
        "secret_errado_qualquer",
        algorithm=settings.jwt_algorithm,
    )
    with pytest.raises(InvalidApprovalToken):
        verify_approval_token(bad_token)


def test_verify_rejeita_tipo_diferente() -> None:
    settings = get_settings()
    payload = {
        "post_id": str(uuid4()),
        "tenant_id": str(uuid4()),
        "type": "reset_password",
        "iat": int(datetime.now(UTC).timestamp()),
        "exp": int((datetime.now(UTC) + timedelta(hours=1)).timestamp()),
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    with pytest.raises(InvalidApprovalToken, match="tipo de token"):
        verify_approval_token(token)


def test_verify_rejeita_claim_obrigatoria_faltando() -> None:
    settings = get_settings()
    payload = {
        "tenant_id": str(uuid4()),
        "type": "approval",
        "iat": int(datetime.now(UTC).timestamp()),
        "exp": int((datetime.now(UTC) + timedelta(hours=1)).timestamp()),
    }  # sem post_id
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    with pytest.raises(InvalidApprovalToken, match="post_id"):
        verify_approval_token(token)


def test_ttl_default_usa_setting_do_env() -> None:
    """ttl_hours=None → usa jwt_expires_hours do config."""
    settings = get_settings()
    with patch("app.services.jwt.datetime") as mock_dt:
        fixed = datetime(2026, 6, 1, 12, 0, 0, tzinfo=UTC)
        mock_dt.now.return_value = fixed
        token = sign_approval_token(post_id=uuid4(), tenant_id=uuid4(), ttl_hours=None)
    payload = verify_approval_token(token)
    expected_exp = int((fixed + timedelta(hours=settings.jwt_expires_hours)).timestamp())
    assert payload["exp"] == expected_exp
