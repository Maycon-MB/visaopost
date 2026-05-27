"""Integration test: posts repository toca DB real. Marker @db.

Requer seed 0003 aplicado (tenant dilorenzo). Cleanup deleta posts criados.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from datetime import datetime, timezone

import asyncpg
import pytest
import pytest_asyncio

from app.db.pool import acquire, close_pool, init_pool
from app.db.repositories.posts import create_post
from app.db.repositories.tenants import get_tenant_id_by_slug


@pytest_asyncio.fixture
async def db() -> AsyncIterator[None]:
    try:
        await init_pool()
    except (asyncpg.PostgresError, OSError) as exc:
        pytest.skip(f"DB indisponível: {exc}")
    try:
        yield None
    finally:
        # Cleanup: deleta posts de teste do tenant piloto.
        try:
            async with acquire() as conn:
                await conn.execute(
                    "DELETE FROM posts WHERE theme = $1",
                    "__test_theme_fase4__",
                )
        finally:
            await close_pool()


@pytest.mark.db
async def test_get_tenant_id_by_slug_dilorenzo(db: None) -> None:
    tenant_id = await get_tenant_id_by_slug("dilorenzo")
    assert tenant_id is not None


@pytest.mark.db
async def test_get_tenant_id_by_slug_inexistente(db: None) -> None:
    tenant_id = await get_tenant_id_by_slug("nao-existe-slug-xyz")
    assert tenant_id is None


@pytest.mark.db
async def test_create_post_persiste_e_retorna_pydantic(db: None) -> None:
    tenant_id = await get_tenant_id_by_slug("dilorenzo")
    assert tenant_id is not None

    scheduled = datetime(2026, 6, 1, 12, 0, tzinfo=timezone.utc)
    post = await create_post(
        tenant_id=tenant_id,
        scheduled_at=scheduled,
        theme="__test_theme_fase4__",
        caption="Caption longa o bastante para passar no validador Pydantic.",
        hashtags=["teste", "fase_4", "post_repo"],
        cta="Agende seu exame",
        mood="informativo",
        holiday_name=None,
        image_url="/posts/fake.jpg",
        ai_html="<html></html>",
        ai_prompt={"foo": "bar"},
    )

    assert post.tenant_id == tenant_id
    assert post.theme == "__test_theme_fase4__"
    assert post.hashtags == ["teste", "fase_4", "post_repo"]
    assert post.cta == "Agende seu exame"
    assert post.status == "draft"
    assert post.image_url == "/posts/fake.jpg"


@pytest.mark.db
async def test_create_post_persiste_cta_em_metadata_jsonb(db: None) -> None:
    tenant_id = await get_tenant_id_by_slug("dilorenzo")
    assert tenant_id is not None

    post = await create_post(
        tenant_id=tenant_id,
        scheduled_at=datetime(2026, 6, 2, 12, 0, tzinfo=timezone.utc),
        theme="__test_theme_fase4__",
        caption="Outra caption longa o bastante para passar no validador.",
        hashtags=["teste", "fase_4", "meta_cta"],
        cta="Conheça a coleção",
        holiday_name="Carnaval",
    )

    async with acquire() as conn:
        row = await conn.fetchrow(
            "SELECT metadata FROM posts WHERE id = $1",
            post.id,
        )
    assert row is not None
    metadata = row["metadata"]
    if isinstance(metadata, str):
        import json
        metadata = json.loads(metadata)
    assert metadata["cta"] == "Conheça a coleção"
    assert metadata["holiday_name"] == "Carnaval"


@pytest.mark.db
async def test_create_post_rejeita_status_invalido(db: None) -> None:
    tenant_id = await get_tenant_id_by_slug("dilorenzo")
    assert tenant_id is not None
    with pytest.raises(ValueError, match="status inválido"):
        await create_post(
            tenant_id=tenant_id,
            scheduled_at=datetime(2026, 6, 3, 12, 0, tzinfo=timezone.utc),
            theme="__test_theme_fase4__",
            caption="Caption longa pra passar no validador Pydantic.",
            hashtags=["a1", "b2", "c3"],
            cta="Agende seu exame",
            status="banana_status",
        )
