"""Gera roteiros para Reels de Autoridade via Gemini.

Pipeline: build_prompt → call_model (JSON mode) → parse → Pydantic validate.
Segue o mesmo padrão de caption.py (Protocol + retry + backoff).
"""

from __future__ import annotations

import json
from typing import Any, Protocol

import google.generativeai as genai
from pydantic import ValidationError

from app.config import get_settings
from app.logging import get_logger
from app.models.reel import ReelScriptCreate, ReelScriptOutput, ReelTom
from app.services._gemini_retry import call_with_backoff

logger = get_logger(__name__)

_MODEL_NAME = "gemini-flash-latest"
_MAX_OUTPUT_TOKENS = 4096
_MAX_ATTEMPTS = 2

_TOM_DESCRICAO = {
    ReelTom.autoridade: (
        "Posicionamento de ESPECIALISTAS. Tom confiante, técnico mas acessível. "
        "Demonstra expertise sem arrogância. Ex: 'Como profissionais de visão, sabemos que...', "
        "'Depois de centenas de atendimentos, a lição mais importante é...'"
    ),
    ReelTom.educativo: (
        "EDUCATIVO e informativo. Formato '3 dicas', 'Você sabia que', 'O que ninguém te contou sobre'. "
        "Engaja pelo conhecimento. Linguagem leve e direta."
    ),
    ReelTom.promo: (
        "LANÇAMENTO ou destaque de produto/serviço. Tom entusiasmado mas refinado, sem exagero barato. "
        "Foco nos benefícios reais. SEM mencionar preço. SEM urgência artificial."
    ),
}

_DURACAO_INSTRUCAO = {
    15: "15 SEGUNDOS: Hook impactante (3s) + 1 ponto central (10s) + CTA curto (2s). ~30-40 palavras no roteiro.",
    30: "30 SEGUNDOS: Hook (4s) + 2-3 pontos em sequência rápida (22s) + CTA (4s). ~70-90 palavras no roteiro.",
    60: "60 SEGUNDOS: Hook (5s) + 4-5 pontos com micro-exemplos (48s) + CTA forte (7s). ~140-180 palavras no roteiro.",
}


class ReelModelClient(Protocol):
    def generate(self, prompt: str) -> tuple[str, str | None]:
        """Retorna (texto, finish_reason)."""
        ...


class _GeminiJsonReelClient:
    def __init__(self, api_key: str) -> None:
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY ausente no .env")
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel(_MODEL_NAME)
        self._config = genai.types.GenerationConfig(
            temperature=0.9,
            top_p=0.95,
            max_output_tokens=_MAX_OUTPUT_TOKENS,
            response_mime_type="application/json",
        )

    def generate(self, prompt: str) -> tuple[str, str | None]:
        response = call_with_backoff(
            lambda: self._model.generate_content(prompt, generation_config=self._config)
        )
        text = response.text or ""
        try:
            finish = response.candidates[0].finish_reason.name
        except (AttributeError, IndexError):
            finish = None
        return text, finish


def build_reel_prompt(payload: ReelScriptCreate, business_name: str = "Ótica Di Lorenzo") -> str:
    produto_linha = f"- Produto/serviço em destaque: {payload.produto}" if payload.produto else ""
    tom_desc = _TOM_DESCRICAO[payload.tom]
    duracao_desc = _DURACAO_INSTRUCAO[payload.duracao_s]

    return f"""Você é roteirista sênior de social media para ótica premium brasileira. Especialista em Reels de autoridade para o setor óptico.

Crie um roteiro completo de Reel para Instagram em português do Brasil.

CLIENTE:
- Nome: {business_name}
- Instagram: @oticadilorenzo
- Posicionamento: Ótica premium, especialistas em visão e estilo

BRIEFING:
- Tema: {payload.tema}
{produto_linha}
- Duração: {duracao_desc}
- Tom: {tom_desc}

REGRAS RÍGIDAS:
- Responda APENAS com JSON válido. Sem markdown, sem texto fora do JSON.
- Estrutura EXATA:
  {{
    "hook": "...",
    "roteiro": "...",
    "legenda": "...",
    "hashtags": ["..."],
    "cta_verbal": "...",
    "cta_legenda": "..."
  }}

CAMPO "hook":
- Primeiras 1-2 frases do vídeo — as que aparecem em tela para parar o scroll.
- Deve criar curiosidade imediata ou fazer uma afirmação surpreendente.
- Máx 25 palavras. Sem emoji.
- Exemplos bons: "Você provavelmente está usando o óculos errado para o seu rosto." | "Existe um tipo de lente que 80% das pessoas que usam óculos nunca ouviram falar."

CAMPO "roteiro":
- Texto corrido que o apresentador vai falar, na sequência do vídeo.
- Inclua quebras de linha entre blocos/beats. Use [PAUSA] onde houver pausa visual.
- Linguagem falada, não escrita. Frases curtas.
- NÃO inclua instruções de câmera, edição, música ou emojis.
- Deve terminar com o cta_verbal integrado naturalmente.

CAMPO "legenda":
- Caption do Instagram para publicar junto com o Reel.
- 120 a 500 caracteres. Português BR.
- Primeiro parágrafo = hook adaptado para texto.
- Máx 2 emojis relevantes.
- SEM hashtags no corpo (vão no campo hashtags).

CAMPO "hashtags":
- 8 a 12 strings. SEM `#`. Letras minúsculas, sem acento, sem espaço.
- Mix: nicho óptico (otica, oculosdesol, visao) + autoridade (dicasdeotica, saudedoseusolhos) + local (riodejaneiro, rj).

CAMPO "cta_verbal":
- Última frase falada no vídeo. 5 a 12 palavras. Direcionamento claro.
- Ex: "Me chama no direct pra te ajudar a encontrar o seu."

CAMPO "cta_legenda":
- CTA escrito na legenda. 5 a 15 palavras.
- Ex: "Agende sua consulta no link da bio."

ANTI-INVENÇÃO (CRÍTICO — questão legal):
- NÃO invente depoimentos, nomes de clientes, idades, profissões.
- NÃO use citações atribuídas a pessoas específicas.
- NÃO invente métricas ("95% dos clientes", "mais de 1.000 atendimentos").
- NÃO mencione preços, descontos, prazos, endereço ou telefone.
- NÃO faça promessas médicas de cura, diagnóstico ou tratamento.

ORTOGRAFIA pt-BR: óculos (com acento), visão, lente, armação, oftalmologista, oftalmologia.

Retorne SOMENTE o JSON.
"""


def _extract_json(raw: str) -> str:
    text = raw.strip()
    if text.startswith("```"):
        first_nl = text.find("\n")
        if first_nl != -1:
            text = text[first_nl + 1:]
        if text.endswith("```"):
            text = text[:-3].rstrip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return text.strip()
    return text[start: end + 1].strip()


def parse_reel_output(raw: str) -> ReelScriptOutput:
    text = _extract_json(raw)
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"JSON malformado: {exc.msg}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"esperado objeto JSON, recebi {type(data).__name__}")
    try:
        return ReelScriptOutput.model_validate(data)
    except ValidationError as exc:
        raise ValueError(f"ReelScriptOutput inválido: {exc.error_count()} erro(s)") from exc


def generate_reel_script(
    *,
    payload: ReelScriptCreate,
    business_name: str = "Ótica Di Lorenzo",
    client: ReelModelClient | None = None,
) -> tuple[ReelScriptOutput, dict[str, Any]]:
    actual_client: ReelModelClient = client or _GeminiJsonReelClient(get_settings().gemini_api_key)
    prompt = build_reel_prompt(payload, business_name)

    output: ReelScriptOutput | None = None
    finish_reason: str | None = None
    last_error: str | None = None
    attempt = 0

    while attempt < _MAX_ATTEMPTS:
        attempt += 1
        raw, finish_reason = actual_client.generate(prompt)
        try:
            output = parse_reel_output(raw)
            break
        except ValueError as exc:
            last_error = str(exc)
            logger.warning(
                "reel.parse_failed",
                attempt=attempt,
                finish_reason=finish_reason,
                error=last_error,
            )

    if output is None:
        raise RuntimeError(
            f"Gemini retornou roteiro inválido após {attempt} tentativa(s): {last_error}"
        )

    meta = {
        "model": _MODEL_NAME,
        "tema": payload.tema,
        "tom": payload.tom,
        "duracao_s": payload.duracao_s,
        "prompt_chars": len(prompt),
        "roteiro_words": len(output.roteiro.split()),
        "hashtag_count": len(output.hashtags),
        "attempts": attempt,
        "finish_reason": finish_reason,
    }
    logger.info("reel.generated", **meta)
    return output, meta
