"""Testa pipeline caption.py com ModelClient fake.

Cobertura: build_prompt, extract_json, parse_post_copy, retry, max_attempts.
Não toca Gemini real.
"""

from __future__ import annotations

import json

import pytest

from app.models.brand import BrandKit, ThemeContext
from app.models.post import PostCopy
from app.services.caption import (
    build_prompt,
    extract_json,
    generate_post_copy,
    parse_post_copy,
)


class FakeClient:
    """Cliente determinístico, devolve responses pré-programadas."""

    def __init__(self, responses: list[tuple[str, str | None]]) -> None:
        self._responses = list(responses)
        self.calls = 0

    def generate(self, prompt: str) -> tuple[str, str | None]:
        self.calls += 1
        if not self._responses:
            raise RuntimeError("FakeClient: chamadas além do esperado")
        return self._responses.pop(0)


VALID_PAYLOAD = {
    "caption": (
        "A coleção primavera chegou na Ótica Di Lorenzo com armações leves "
        "e cores que conversam com o brilho da estação. Agende seu exame."
    ),
    "hashtags": [
        "oticadilorenzo",
        "oculosdegrau",
        "estilo",
        "moda",
        "saude_visual",
        "primavera",
        "armacao_nova",
    ],
    "cta": "Agende seu exame",
}
VALID_JSON = json.dumps(VALID_PAYLOAD, ensure_ascii=False)


def test_build_prompt_inclui_marca_tema_e_regras_json(
    brand_kit: BrandKit, theme_natal: ThemeContext
) -> None:
    prompt = build_prompt(brand_kit, theme_natal)
    assert brand_kit.business_name in prompt
    assert "Natal" in prompt
    assert "familia" in prompt
    assert "JSON" in prompt
    assert "caption" in prompt and "hashtags" in prompt and "cta" in prompt


def test_extract_json_strip_fence_markdown() -> None:
    raw = f"```json\n{VALID_JSON}\n```"
    assert extract_json(raw) == VALID_JSON


def test_extract_json_strip_texto_antes_e_depois() -> None:
    raw = f"Aqui está:\n{VALID_JSON}\nFim."
    out = extract_json(raw)
    assert out.startswith("{") and out.endswith("}")
    assert json.loads(out) == VALID_PAYLOAD


def test_parse_post_copy_valido() -> None:
    copy = parse_post_copy(VALID_JSON)
    assert isinstance(copy, PostCopy)
    assert copy.cta == "Agende seu exame"
    assert len(copy.hashtags) == 7


def test_parse_post_copy_rejeita_json_malformado() -> None:
    with pytest.raises(ValueError, match="JSON malformado"):
        parse_post_copy("{nao eh json}")


def test_parse_post_copy_rejeita_payload_invalido() -> None:
    bad = json.dumps({"caption": "x", "hashtags": ["a"], "cta": "y"})
    with pytest.raises(ValueError, match="PostCopy inválido"):
        parse_post_copy(bad)


def test_parse_post_copy_normaliza_hashtag_com_hash_prefix() -> None:
    payload = {**VALID_PAYLOAD, "hashtags": [f"#{h}" for h in VALID_PAYLOAD["hashtags"]]}
    copy = parse_post_copy(json.dumps(payload))
    assert all(not h.startswith("#") for h in copy.hashtags)


def test_generate_post_copy_sucesso_primeira_tentativa(
    brand_kit: BrandKit, theme_natal: ThemeContext
) -> None:
    client = FakeClient([(VALID_JSON, "STOP")])
    copy, meta = generate_post_copy(brand=brand_kit, theme=theme_natal, client=client)
    assert copy.cta == "Agende seu exame"
    assert meta["attempts"] == 1
    assert meta["finish_reason"] == "STOP"
    assert client.calls == 1


def test_generate_post_copy_retry_apos_json_malformado(
    brand_kit: BrandKit, theme_natal: ThemeContext
) -> None:
    client = FakeClient([("lixo nao json", "STOP"), (VALID_JSON, "STOP")])
    copy, meta = generate_post_copy(brand=brand_kit, theme=theme_natal, client=client)
    assert copy.cta == "Agende seu exame"
    assert meta["attempts"] == 2
    assert client.calls == 2


def test_generate_post_copy_falha_apos_max_attempts(
    brand_kit: BrandKit, theme_natal: ThemeContext
) -> None:
    client = FakeClient([("lixo", "STOP"), ("ainda lixo", "STOP")])
    with pytest.raises(RuntimeError, match="copy inválida"):
        generate_post_copy(brand=brand_kit, theme=theme_natal, client=client)
    assert client.calls == 2


def test_post_copy_validacao_hashtag_invalida() -> None:
    payload = {**VALID_PAYLOAD, "hashtags": [*VALID_PAYLOAD["hashtags"], "oculos com espaco"]}
    with pytest.raises(ValueError, match="PostCopy inválido"):
        parse_post_copy(json.dumps(payload))


def test_post_copy_validacao_hashtag_duplicada() -> None:
    payload = {
        **VALID_PAYLOAD,
        "hashtags": [*VALID_PAYLOAD["hashtags"], VALID_PAYLOAD["hashtags"][0]],
    }
    with pytest.raises(ValueError, match="PostCopy inválido"):
        parse_post_copy(json.dumps(payload))
