"""Testa pipeline template_generator com ModelClient fake.

Não chama Gemini real (sem rede, sem cota). Cobre:
- build_prompt: marca + tema aparecem no prompt
- extract_html: strip fences markdown
- generate_post_html: retry em HTML truncado, falha após 2 tentativas
"""

from __future__ import annotations

import pytest

from app.models.brand import BrandKit, ThemeContext
from app.services.template_generator import (
    build_prompt,
    extract_html,
    generate_post_html,
    is_complete_html,
)


class FakeClient:
    """ModelClient determinístico. Responses controladas pelo teste."""

    def __init__(self, responses: list[tuple[str, str | None]]) -> None:
        self._responses = list(responses)
        self.calls = 0

    def generate(self, prompt: str) -> tuple[str, str | None]:
        self.calls += 1
        if not self._responses:
            raise RuntimeError("FakeClient: chamadas alem do esperado")
        return self._responses.pop(0)


FULL_HTML = (
    "<!DOCTYPE html><html><head><style>body{}</style></head>" "<body><h1>Hi</h1></body></html>"
)
TRUNCATED_HTML = "<!DOCTYPE html><html><head><style>body{color:re"


def test_build_prompt_inclui_brand_e_tema(brand_kit: BrandKit, theme_natal: ThemeContext) -> None:
    prompt = build_prompt(brand_kit, theme_natal)
    assert brand_kit.business_name in prompt
    assert brand_kit.colors.primary in prompt
    assert "Natal" in prompt
    assert "familia" in prompt
    assert "1080x1080" in prompt


def test_build_prompt_sem_holiday_usa_theme(brand_kit: BrandKit) -> None:
    ctx = ThemeContext(theme="black_friday")
    prompt = build_prompt(brand_kit, ctx)
    assert "black friday" in prompt  # underscore virou espaço


def test_extract_html_strip_markdown_fence() -> None:
    raw = f"```html\n{FULL_HTML}\n```"
    assert extract_html(raw) == FULL_HTML


def test_extract_html_strip_text_antes_doctype() -> None:
    raw = f"Aqui esta:\n{FULL_HTML}\nFim."
    out = extract_html(raw)
    assert out.startswith("<!DOCTYPE")
    assert out.endswith("</html>")


def test_is_complete_html() -> None:
    assert is_complete_html(FULL_HTML)
    assert not is_complete_html(TRUNCATED_HTML)


def test_generate_html_success_primeira_tentativa(
    brand_kit: BrandKit, theme_natal: ThemeContext
) -> None:
    client = FakeClient([(FULL_HTML, "STOP")])
    html, meta = generate_post_html(brand=brand_kit, theme=theme_natal, client=client)
    assert html == FULL_HTML
    assert meta["attempts"] == 1
    assert meta["finish_reason"] == "STOP"
    assert client.calls == 1


def test_generate_html_retry_se_truncado(brand_kit: BrandKit, theme_natal: ThemeContext) -> None:
    client = FakeClient([(TRUNCATED_HTML, "MAX_TOKENS"), (FULL_HTML, "STOP")])
    html, meta = generate_post_html(brand=brand_kit, theme=theme_natal, client=client)
    assert html == FULL_HTML
    assert meta["attempts"] == 2
    assert client.calls == 2


def test_generate_html_falha_apos_max_tentativas(
    brand_kit: BrandKit, theme_natal: ThemeContext
) -> None:
    client = FakeClient([(TRUNCATED_HTML, "MAX_TOKENS"), (TRUNCATED_HTML, "MAX_TOKENS")])
    with pytest.raises(RuntimeError, match="truncado"):
        generate_post_html(brand=brand_kit, theme=theme_natal, client=client)
    assert client.calls == 2
