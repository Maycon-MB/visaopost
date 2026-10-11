"""Webhook WhatsApp falha fechado: sem assinatura valida, nada e processado."""

from __future__ import annotations

import hashlib
import hmac
from typing import Any
from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api import whatsapp
from app.config import Settings

CORPO = b'{"object": "whatsapp_business_account", "entry": []}'
SEGREDO = "app-secret-de-teste"


def _assinar(corpo: bytes, segredo: str) -> str:
    return "sha256=" + hmac.new(segredo.encode(), corpo, hashlib.sha256).hexdigest()


@pytest.fixture
def processar(monkeypatch: pytest.MonkeyPatch) -> AsyncMock:
    mock = AsyncMock()
    monkeypatch.setattr(whatsapp, "process_webhook", mock)
    return mock


def _cliente(monkeypatch: pytest.MonkeyPatch, app_secret: str) -> TestClient:
    settings = Settings(_env_file=None, whatsapp_app_secret=app_secret)
    monkeypatch.setattr(whatsapp, "get_settings", lambda: settings)
    app = FastAPI()
    app.include_router(whatsapp.router)
    return TestClient(app)


def _post(cliente: TestClient, headers: dict[str, str] | None = None) -> Any:
    return cliente.post(
        "/webhook/whatsapp",
        content=CORPO,
        headers={"content-type": "application/json", **(headers or {})},
    )


def test_sem_app_secret_configurado_rejeita(
    monkeypatch: pytest.MonkeyPatch, processar: AsyncMock
) -> None:
    resposta = _post(_cliente(monkeypatch, ""), {"x-hub-signature-256": _assinar(CORPO, "")})
    assert resposta.status_code == 503
    processar.assert_not_called()


def test_sem_assinatura_rejeita(monkeypatch: pytest.MonkeyPatch, processar: AsyncMock) -> None:
    resposta = _post(_cliente(monkeypatch, SEGREDO))
    assert resposta.status_code == 401
    processar.assert_not_called()


def test_assinatura_errada_rejeita(monkeypatch: pytest.MonkeyPatch, processar: AsyncMock) -> None:
    resposta = _post(
        _cliente(monkeypatch, SEGREDO), {"x-hub-signature-256": _assinar(CORPO, "outro")}
    )
    assert resposta.status_code == 401
    processar.assert_not_called()


def test_assinatura_valida_aceita(monkeypatch: pytest.MonkeyPatch, processar: AsyncMock) -> None:
    resposta = _post(
        _cliente(monkeypatch, SEGREDO), {"x-hub-signature-256": _assinar(CORPO, SEGREDO)}
    )
    assert resposta.status_code == 200
    assert resposta.json() == {"status": "ok"}
