"""Gera legenda + hashtags + CTA via Gemini.

Pipeline: build_prompt → call_model (JSON mode) → parse → Pydantic validate.
Retry quando JSON malformado ou Pydantic rejeita.

`ModelClient` Protocol = mesma abstração de template_generator, mas request
modo JSON (`application/json`) pra parsing determinístico.
"""

from __future__ import annotations

import json
from typing import Any, Protocol

import google.generativeai as genai
from pydantic import ValidationError

from app.config import get_settings
from app.logging import get_logger
from app.models.brand import BrandKit, ThemeContext
from app.models.post import PostCopy

logger = get_logger(__name__)

_MODEL_NAME = "gemini-flash-latest"
# 2048 batia MAX_TOKENS em ~10% dos casos (caption longa + 10 hashtags + cta).
# Retry resolvia, mas custava 1 chamada extra. 4096 elimina sem custo notável.
_MAX_OUTPUT_TOKENS = 4096
_MAX_ATTEMPTS = 2


class ModelClient(Protocol):
    """Cliente Gemini abstrato para DI em testes."""

    def generate(self, prompt: str) -> tuple[str, str | None]:
        """Retorna (texto, finish_reason)."""
        ...


class _GeminiJsonClient:
    """Cliente real configurado para responder JSON."""

    def __init__(self, api_key: str, model_name: str = _MODEL_NAME) -> None:
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY ausente no .env")
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel(model_name)
        self._config = genai.types.GenerationConfig(
            temperature=0.85,
            top_p=0.95,
            max_output_tokens=_MAX_OUTPUT_TOKENS,
            response_mime_type="application/json",
        )

    def generate(self, prompt: str) -> tuple[str, str | None]:
        response = self._model.generate_content(prompt, generation_config=self._config)
        text = response.text or ""
        try:
            finish = response.candidates[0].finish_reason.name
        except (AttributeError, IndexError):
            finish = None
        return text, finish


def build_prompt(brand: BrandKit, theme: ThemeContext) -> str:
    """Prompt determinístico. Pede JSON estrito com caption/hashtags/cta."""
    occasion = theme.holiday_name or theme.theme.replace("_", " ")
    mood_line = f"Mood do post: {theme.mood}." if theme.mood else ""
    voice = brand.brand_voice or "Tom natural, próximo, sem jargão."
    handle = brand.instagram_handle or "@otica"

    return f"""Você é copywriter sênior de social media para ótica premium brasileira.

Gere a copy de UM post Instagram do feed em português do Brasil.

CONTEXTO DA MARCA:
- Nome: {brand.business_name}
- Handle: {handle}
- Tom de voz: {voice}

TEMA DO POST:
- Ocasião: {occasion}
- {mood_line}

REGRAS RÍGIDAS:
- Responda APENAS com JSON válido. Sem markdown, sem comentário, sem texto fora do JSON.
- Estrutura EXATA:
  {{
    "caption": "...",
    "hashtags": ["...", "..."],
    "cta": "..."
  }}
- caption: 120 a 600 caracteres. Português BR. Sem emoji excessivo (máx 2). Quebra de linha permitida.
- hashtags: lista de 8 a 12 strings. SEM `#`. Apenas letras minúsculas a-z, números, underscore. Sem acento, sem espaço.
- cta: chamada à ação em 3 a 8 palavras. Ex: "Agende seu exame", "Conheça a coleção".
- Mantenha alinhamento com tom da marca. Evite urgência exagerada estilo Casas Bahia.
- NÃO mencione preço. NÃO prometa cura/diagnóstico médico.

ANTI-INVENÇÃO (CRÍTICO — questão legal):
- NÃO invente nomes de pessoas, depoimentos atribuídos, idade, profissão de cliente.
- NÃO escreva citações entre aspas atribuídas a alguém específico (ex: `"...", — Mariana S.`).
- NÃO invente métricas (ex: "95% dos clientes", "mais de 1.000 atendidos").
- NÃO invente prazos, descontos numéricos, garantia em meses, endereço, telefone.
- Se o tema for depoimento, use linguagem GENÉRICA em 1ª pessoa do plural da marca: "nada nos move mais do que ver o olhar de quem confia em nós", SEM atribuir a uma pessoa.

ORTOGRAFIA pt-BR (atenção): performance (R no meio), excelência (Ê+cedilha), sofisticação (Ç), requinte. Use acentos corretos.

Retorne SOMENTE o JSON.
"""


def extract_json(raw: str) -> str:
    """Remove fences markdown e texto fora do bloco JSON."""
    text = raw.strip()
    if text.startswith("```"):
        first_nl = text.find("\n")
        if first_nl != -1:
            text = text[first_nl + 1 :]
        if text.endswith("```"):
            text = text[:-3].rstrip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return text.strip()
    return text[start : end + 1].strip()


def parse_post_copy(raw: str) -> PostCopy:
    """Parse JSON → PostCopy. Levanta ValueError se inválido."""
    text = extract_json(raw)
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"JSON malformado: {exc.msg}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"esperado objeto JSON, recebi {type(data).__name__}")
    try:
        return PostCopy.model_validate(data)
    except ValidationError as exc:
        raise ValueError(f"PostCopy inválido: {exc.error_count()} erro(s)") from exc


def generate_post_copy(
    *,
    brand: BrandKit,
    theme: ThemeContext,
    client: ModelClient | None = None,
) -> tuple[PostCopy, dict[str, Any]]:
    """Pipeline completa. Retry se JSON/validação falha. Levanta após max tentativas."""
    actual_client: ModelClient = client or _GeminiJsonClient(get_settings().gemini_api_key)
    prompt = build_prompt(brand, theme)

    copy: PostCopy | None = None
    finish_reason: str | None = None
    last_error: str | None = None
    attempt = 0
    while attempt < _MAX_ATTEMPTS:
        attempt += 1
        raw, finish_reason = actual_client.generate(prompt)
        try:
            copy = parse_post_copy(raw)
            break
        except ValueError as exc:
            last_error = str(exc)
            logger.warning(
                "caption.parse_failed",
                attempt=attempt,
                finish_reason=finish_reason,
                error=last_error,
            )

    if copy is None:
        raise RuntimeError(
            f"Gemini retornou copy inválida após {attempt} tentativa(s): {last_error}"
        )

    meta = {
        "model": _MODEL_NAME,
        "theme": theme.theme,
        "mood": theme.mood,
        "holiday_name": theme.holiday_name,
        "prompt_chars": len(prompt),
        "caption_chars": len(copy.caption),
        "hashtag_count": len(copy.hashtags),
        "attempts": attempt,
        "finish_reason": finish_reason,
    }
    logger.info("caption.generated", **meta)
    return copy, meta
