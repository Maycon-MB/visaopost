"""Testa sign/verify de state OAuth + seleção de página (Fase Instagram OAuth).

Mesma estratégia de `test_jwt.py`: sem rede, sem DB.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest
from jose import jwt

from app.config import get_settings
from app.services.jwt import (
    InvalidOAuthState,
    sign_oauth_state,
    sign_page_selection,
    verify_oauth_state,
    verify_page_selection,
)


def test_oauth_state_roundtrip() -> None:
    tenant_id = uuid4()
    state = sign_oauth_state(tenant_id=tenant_id)
    assert verify_oauth_state(state) == tenant_id


def test_oauth_state_rejeita_expirado() -> None:
    settings = get_settings()
    payload = {
        "tenant_id": str(uuid4()),
        "type": "oauth_state",
        "iat": int((datetime.now(UTC) - timedelta(minutes=30)).timestamp()),
        "exp": int((datetime.now(UTC) - timedelta(minutes=20)).timestamp()),
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    with pytest.raises(InvalidOAuthState):
        verify_oauth_state(token)


def test_oauth_state_rejeita_tipo_errado() -> None:
    settings = get_settings()
    payload = {
        "tenant_id": str(uuid4()),
        "type": "approval",  # tipo de outro fluxo
        "iat": int(datetime.now(UTC).timestamp()),
        "exp": int((datetime.now(UTC) + timedelta(minutes=10)).timestamp()),
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    with pytest.raises(InvalidOAuthState, match="tipo de state"):
        verify_oauth_state(token)


def test_page_selection_roundtrip() -> None:
    tenant_id = uuid4()
    pages = [{"page_id": "123", "page_name": "Ótica Di Lorenzo"}]
    token = sign_page_selection(tenant_id=tenant_id, pages=pages)
    assert verify_page_selection(token, tenant_id=tenant_id) == pages


def test_page_selection_rejeita_tenant_diferente() -> None:
    token = sign_page_selection(tenant_id=uuid4(), pages=[{"page_id": "123"}])
    with pytest.raises(InvalidOAuthState, match="não pertence"):
        verify_page_selection(token, tenant_id=uuid4())
