"""Integration test: repositories tocam DB real.

Marcado @db. Pula se DATABASE_URL não conecta. Requer seed 0003 aplicado.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from datetime import date

import asyncpg
import pytest
import pytest_asyncio

from app.db.pool import close_pool, init_pool
from app.db.repositories.holidays import find_holiday_by_theme, get_holiday_by_date
from app.db.repositories.tenants import get_brand_kit


@pytest_asyncio.fixture
async def db() -> AsyncIterator[None]:
    """Pool por teste (evita compartilhar loop)."""
    try:
        await init_pool()
    except (asyncpg.PostgresError, OSError) as exc:
        pytest.skip(f"DB indisponivel: {exc}")
    try:
        yield None
    finally:
        await close_pool()


@pytest.mark.asyncio
@pytest.mark.db
async def test_get_brand_kit_dilorenzo(db: None) -> None:
    kit = await get_brand_kit("dilorenzo")
    assert kit is not None
    assert kit.business_name == "Otica Di Lorenzo"
    assert kit.colors.primary == "#0D3322"
    assert kit.colors.secondary == "#D4AF37"
    assert kit.instagram_handle == "@otica.dilorenzo"


@pytest.mark.asyncio
@pytest.mark.db
async def test_get_brand_kit_inexistente_retorna_none(db: None) -> None:
    kit = await get_brand_kit("nao-existe-slug-xyz")
    assert kit is None


@pytest.mark.asyncio
@pytest.mark.db
async def test_find_holiday_by_theme_carnaval_determinista(db: None) -> None:
    h = await find_holiday_by_theme("carnaval")
    assert h is not None
    assert h.theme == "carnaval"


@pytest.mark.asyncio
@pytest.mark.db
async def test_get_holiday_by_date_natal_2026(db: None) -> None:
    h = await get_holiday_by_date(date(2026, 12, 25))
    assert h is not None
    assert h.name == "Natal"
