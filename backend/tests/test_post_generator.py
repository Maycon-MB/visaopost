"""Testa orquestração end-to-end com fakes. Sem DB, sem Gemini, sem Chromium."""

from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from typing import Any
from uuid import UUID, uuid4

import pytest

from app.models.brand import BrandKit, ThemeContext
from app.models.post import Post, PostCopy
from app.services import post_generator as pg

FAKE_TENANT_ID = UUID("11111111-1111-1111-1111-111111111111")
FAKE_HTML = "<!DOCTYPE html><html><body>fake</body></html>"
FAKE_JPEG = b"\xff\xd8\xff\xe0fake-jpeg"


@pytest.fixture
def patched_pipeline(
    monkeypatch: pytest.MonkeyPatch,
    brand_kit: BrandKit,
    tmp_path: Path,
) -> dict[str, Any]:
    captured: dict[str, Any] = {}

    async def fake_get_brand_kit(slug: str) -> BrandKit | None:
        captured["brand_slug"] = slug
        return brand_kit if slug == "dilorenzo" else None

    async def fake_get_tenant_id(slug: str) -> UUID | None:
        return FAKE_TENANT_ID if slug == "dilorenzo" else None

    async def fake_resolve_theme(target: date) -> ThemeContext:
        captured["resolved_date"] = target
        return ThemeContext(theme="estilo_aviador", mood="aspiracional")

    def fake_generate_copy(*, brand: BrandKit, theme: ThemeContext) -> tuple[PostCopy, dict[str, Any]]:
        captured["copy_theme"] = theme.theme
        copy = PostCopy(
            caption="Caption suficientemente longa para passar no validador Pydantic v2.",
            hashtags=["a1", "b2", "c3", "d4", "e5"],
            cta="Agende seu exame",
        )
        return copy, {"attempts": 1}

    def fake_generate_html(*, brand: BrandKit, theme: ThemeContext) -> tuple[str, dict[str, Any]]:
        return FAKE_HTML, {"attempts": 1}

    async def fake_render(html: str, **_: Any) -> bytes:
        captured["rendered_html"] = html
        return FAKE_JPEG

    async def fake_create_post(**kwargs: Any) -> Post:
        captured["create_post_kwargs"] = kwargs
        return Post(
            id=uuid4(),
            tenant_id=kwargs["tenant_id"],
            scheduled_at=kwargs["scheduled_at"],
            status=kwargs["status"],
            image_url=kwargs.get("image_url"),
            caption=kwargs["caption"],
            hashtags=list(kwargs["hashtags"]),
            cta=kwargs["cta"],
            theme=kwargs["theme"],
            mood=kwargs.get("mood"),
            holiday_name=kwargs.get("holiday_name"),
            created_at=datetime.now(),
        )

    monkeypatch.setattr(pg, "get_brand_kit", fake_get_brand_kit)
    monkeypatch.setattr(pg, "get_tenant_id_by_slug", fake_get_tenant_id)
    monkeypatch.setattr(pg, "resolve_theme", fake_resolve_theme)
    monkeypatch.setattr(pg, "generate_post_copy", fake_generate_copy)
    monkeypatch.setattr(pg, "generate_post_html", fake_generate_html)
    monkeypatch.setattr(pg, "render_html_to_jpeg", fake_render)
    monkeypatch.setattr(pg, "create_post", fake_create_post)

    captured["output_dir"] = tmp_path / "posts"
    return captured


async def test_generate_post_happy_path(patched_pipeline: dict[str, Any]) -> None:
    target = date(2026, 6, 1)
    post = await pg.generate_post(
        tenant_slug="dilorenzo",
        target_date=target,
        output_dir=patched_pipeline["output_dir"],
    )

    assert post.theme == "estilo_aviador"
    assert post.mood == "aspiracional"
    assert post.holiday_name is None
    assert post.tenant_id == FAKE_TENANT_ID
    assert post.cta == "Agende seu exame"
    assert post.status == "draft"
    assert post.scheduled_at.date() == target
    assert post.scheduled_at.hour == 12


async def test_generate_post_escreve_jpeg_no_disco(patched_pipeline: dict[str, Any]) -> None:
    post = await pg.generate_post(
        tenant_slug="dilorenzo",
        target_date=date(2026, 6, 1),
        output_dir=patched_pipeline["output_dir"],
    )
    file_path = patched_pipeline["output_dir"] / f"{post.id}.jpg"
    assert file_path.is_file()
    assert file_path.read_bytes() == FAKE_JPEG


async def test_generate_post_tenant_inexistente_raises(patched_pipeline: dict[str, Any]) -> None:
    with pytest.raises(pg.TenantNotFound):
        await pg.generate_post(
            tenant_slug="nao-existe",
            target_date=date(2026, 6, 1),
            output_dir=patched_pipeline["output_dir"],
        )


async def test_generate_post_repassa_theme_pro_html_e_copy(
    patched_pipeline: dict[str, Any],
) -> None:
    await pg.generate_post(
        tenant_slug="dilorenzo",
        target_date=date(2026, 6, 1),
        output_dir=patched_pipeline["output_dir"],
    )
    assert patched_pipeline["copy_theme"] == "estilo_aviador"
    assert patched_pipeline["rendered_html"] == FAKE_HTML
    assert patched_pipeline["resolved_date"] == date(2026, 6, 1)


async def test_generate_post_publish_hour_customizado(
    patched_pipeline: dict[str, Any],
) -> None:
    post = await pg.generate_post(
        tenant_slug="dilorenzo",
        target_date=date(2026, 6, 1),
        output_dir=patched_pipeline["output_dir"],
        publish_hour=18,
    )
    assert post.scheduled_at.hour == 18
