"""Testa /dev/preview com Gemini + renderer mockados.

Não toca DB real nem rede. Substitui repositories e services via monkeypatch.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.models.brand import BrandColors, BrandKit, Holiday

FAKE_HTML = (
    "<!DOCTYPE html><html><head></head><body>Fake post</body></html>"
)
FAKE_JPEG = b"\xff\xd8\xff\xe0fake-jpeg-payload-for-test"


@pytest.fixture
def brand_kit_fixture() -> BrandKit:
    return BrandKit(
        business_name="Otica Di Lorenzo",
        instagram_handle="@otica.dilorenzo",
        brand_voice="elegante",
        colors=BrandColors(primary="#0D3322", secondary="#D4AF37"),
    )


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, brand_kit_fixture: BrandKit) -> TestClient:
    # Garante router /dev ativo
    monkeypatch.setenv("APP_ENV", "dev")
    monkeypatch.setenv("GEMINI_API_KEY", "fake-key-for-test")
    monkeypatch.setenv("DATABASE_URL", "postgresql://x:y@localhost:1/none")

    from app.config import get_settings

    get_settings.cache_clear()

    # Stub repositories
    async def fake_get_brand_kit(slug: str) -> BrandKit | None:
        return brand_kit_fixture if slug == "dilorenzo" else None

    async def fake_find_holiday(theme: str) -> Holiday | None:
        if theme == "natal":
            return Holiday(name="Natal", theme="natal", mood="familia")
        return None

    monkeypatch.setattr("app.api.dev.get_brand_kit", fake_get_brand_kit)
    monkeypatch.setattr("app.api.dev.find_holiday_by_theme", fake_find_holiday)

    # Stub generate_post_html (não chama Gemini)
    def fake_generate(*, brand: BrandKit, theme: Any) -> tuple[str, dict[str, Any]]:
        return FAKE_HTML, {"html_chars": len(FAKE_HTML), "attempts": 1}

    monkeypatch.setattr("app.api.dev.generate_post_html", fake_generate)

    # Stub renderer (não sobe Chromium)
    async def fake_render(html: str, **kw: Any) -> bytes:
        return FAKE_JPEG

    monkeypatch.setattr("app.api.dev.render_html_to_jpeg", fake_render)

    # Stub DB lifecycle (não tenta conectar)
    async def noop() -> None:
        return None

    monkeypatch.setattr("app.main.init_pool", noop)
    monkeypatch.setattr("app.main.close_pool", noop)

    # Re-import main APÓS env + monkeypatch pra dev router carregar
    import importlib

    import app.main as main_module

    importlib.reload(main_module)
    return TestClient(main_module.app)


def test_preview_html_mode_returns_html(client: TestClient) -> None:
    r = client.get("/dev/preview/natal?return_html=true")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/html")
    assert r.text == FAKE_HTML


def test_preview_jpeg_mode_returns_image(client: TestClient) -> None:
    r = client.get("/dev/preview/natal")
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/jpeg"
    assert r.content == FAKE_JPEG


def test_preview_tenant_inexistente_404(client: TestClient) -> None:
    r = client.get("/dev/preview/natal?tenant=naoexiste")
    assert r.status_code == 404


def test_dev_health_services(client: TestClient) -> None:
    r = client.get("/dev/health/services")
    body = r.json()
    assert r.status_code == 200
    assert body["env"] == "dev"
    assert body["gemini_configured"] is True
