"""Testa resolve_theme: holiday hit + fallback orgânico determinístico.

Não toca DB — monkeypatch substitui get_holiday_by_date.
"""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from app.models.brand import Holiday
from app.services import calendar as cal


@pytest.fixture
def patch_no_holidays(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_get(_: date) -> Holiday | None:
        return None

    monkeypatch.setattr("app.services.calendar.get_holiday_by_date", fake_get)


@pytest.fixture
def patch_holiday_natal(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_get(target: date) -> Holiday | None:
        if target == date(2026, 12, 25):
            return Holiday(name="Natal", theme="natal", mood="familia")
        return None

    monkeypatch.setattr("app.services.calendar.get_holiday_by_date", fake_get)


def test_organic_theme_for_deterministico() -> None:
    """Mesma data sempre devolve mesmo (theme, mood)."""
    d = date(2026, 6, 15)
    assert cal.organic_theme_for(d) == cal.organic_theme_for(d)


def test_organic_pool_tem_30_temas_unicos() -> None:
    assert len(cal.ORGANIC_POOL) == 30
    assert len(set(cal.ORGANIC_POOL)) == 30


def test_organic_pool_rotaciona_30_dias_sem_repetir() -> None:
    start = date(2026, 6, 1)
    themes = [cal.organic_theme_for(start + timedelta(days=i))[0] for i in range(30)]
    assert len(set(themes)) == 30, f"repetição: {themes}"


async def test_resolve_theme_usa_holiday_quando_existe(patch_holiday_natal: None) -> None:
    ctx = await cal.resolve_theme(date(2026, 12, 25))
    assert ctx.theme == "natal"
    assert ctx.mood == "familia"
    assert ctx.holiday_name == "Natal"


async def test_resolve_theme_fallback_organico(patch_no_holidays: None) -> None:
    ctx = await cal.resolve_theme(date(2026, 6, 15))
    assert ctx.theme in cal.ORGANIC_POOL
    assert ctx.mood in cal.ORGANIC_MOODS
    assert ctx.holiday_name is None


async def test_resolve_theme_organico_deterministico(patch_no_holidays: None) -> None:
    a = await cal.resolve_theme(date(2026, 6, 15))
    b = await cal.resolve_theme(date(2026, 6, 15))
    assert a == b


async def test_resolve_theme_organico_30_dias_sem_repetir(patch_no_holidays: None) -> None:
    start = date(2026, 6, 1)
    themes = []
    for i in range(30):
        ctx = await cal.resolve_theme(start + timedelta(days=i))
        themes.append(ctx.theme)
    assert len(set(themes)) == 30
