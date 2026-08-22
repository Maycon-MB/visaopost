"""Fixtures compartilhadas. Não exige DB salvo testes marcados @pytest.mark.db."""

from __future__ import annotations

import pytest

from app.models.brand import BrandColors, BrandKit, ThemeContext


@pytest.fixture
def brand_kit() -> BrandKit:
    return BrandKit(
        business_name="Otica Di Lorenzo",
        instagram_handle="@otica.dilorenzo",
        brand_voice="Elegante, sofisticado, proximo.",
        colors=BrandColors(
            primary="#0D3322",
            secondary="#D4AF37",
            accent="#F5F1E8",
            text="#1A1A1A",
            background="#FFFFFF",
        ),
    )


@pytest.fixture
def theme_natal() -> ThemeContext:
    return ThemeContext(theme="natal", mood="familia", holiday_name="Natal")
