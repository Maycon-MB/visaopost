"""Endpoint de pré-checagem — o painel consulta antes de mandar alguém clicar em Conectar."""

from __future__ import annotations

from collections.abc import Iterator
from uuid import UUID, uuid4

import pytest
from fastapi.testclient import TestClient

from app.api.auth import current_tenant_id
from app.config import get_settings
from app.main import app
from app.services.instagram import InstagramPermanentError

TENANT_ID = UUID("33333333-3333-3333-3333-333333333333")


@pytest.fixture
def client() -> Iterator[TestClient]:
    app.dependency_overrides[current_tenant_id] = lambda: TENANT_ID
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_preflight_devolve_lista_de_checagens(client: TestClient) -> None:
    resp = client.get("/auth/facebook/preflight")

    assert resp.status_code == 200
    checks = resp.json()["checks"]
    assert len(checks) >= 5
    assert {"key", "label", "ok", "hint"} <= set(checks[0])


def test_preflight_resume_se_esta_pronto(client: TestClient) -> None:
    resp = client.get("/auth/facebook/preflight")

    body = resp.json()
    assert isinstance(body["ready"], bool)
    assert body["ready"] == all(c["ok"] for c in body["checks"])


def test_preflight_exige_autenticacao() -> None:
    app.dependency_overrides.clear()
    resp = TestClient(app).get("/auth/facebook/preflight")
    assert resp.status_code in (401, 403)


def test_preflight_nao_vaza_o_valor_das_credenciais(
    client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Devolve se a credencial está preenchida — nunca o valor dela."""
    settings = get_settings()
    monkeypatch.setattr(settings, "meta_app_secret", "segredo-super-secreto", raising=False)
    monkeypatch.setattr(settings, "meta_app_id", "111222333444", raising=False)
    app.dependency_overrides[current_tenant_id] = lambda: uuid4()

    corpo = client.get("/auth/facebook/preflight").text

    assert "segredo-super-secreto" not in corpo
    assert "111222333444" not in corpo


def test_teste_de_publicacao_falha_com_instrucao_em_portugues(
    client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Quem lê esse erro é o dono da ótica, no meio da reunião. Código não serve."""

    async def fake_credentials(tenant_id: UUID) -> tuple[str, str]:
        return ("token", "17841400000000000")

    class _BlockedClient:
        async def publish_photo(self, *, image_url: str, caption: str) -> None:
            raise InstagramPermanentError("blocked", status_code=400, code=368)

    monkeypatch.setattr("app.api.instagram_auth.get_instagram_credentials", fake_credentials)
    monkeypatch.setattr(
        "app.api.instagram_auth.get_instagram_client", lambda **kwargs: _BlockedClient()
    )

    resp = client.post("/auth/facebook/test-post")

    assert resp.status_code == 502
    detail = resp.json()["detail"]
    assert detail["ig_error_code"] == 368
    assert "bloque" in detail["hint"].lower()
