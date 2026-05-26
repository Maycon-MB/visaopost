"""Valida tipos Pydantic. Sem DB, sem Gemini."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.models.brand import BrandColors, BrandKit, ThemeContext


def test_brand_colors_aceita_hex_6_digitos() -> None:
    colors = BrandColors(primary="#0d3322", secondary="#D4AF37")
    assert colors.primary == "#0D3322"  # uppercase normalizado
    assert colors.secondary == "#D4AF37"


def test_brand_colors_aceita_hex_3_digitos() -> None:
    colors = BrandColors(primary="#0f0", secondary="#fff")
    assert colors.primary == "#0F0"


def test_brand_colors_rejeita_hex_invalido() -> None:
    with pytest.raises(ValidationError):
        BrandColors(primary="green", secondary="#000")
    with pytest.raises(ValidationError):
        BrandColors(primary="#GGGGGG", secondary="#000")
    with pytest.raises(ValidationError):
        BrandColors(primary="#12345", secondary="#000")


def test_brand_kit_imutavel() -> None:
    kit = BrandKit(
        business_name="X",
        colors=BrandColors(primary="#000", secondary="#FFF"),
    )
    with pytest.raises(ValidationError):
        kit.business_name = "Y"  # type: ignore[misc]


def test_theme_context_rejeita_vazio() -> None:
    with pytest.raises(ValidationError):
        ThemeContext(theme="   ")
    with pytest.raises(ValidationError):
        ThemeContext(theme="")
