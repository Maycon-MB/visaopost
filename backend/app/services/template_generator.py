"""Gera HTML+CSS de post Instagram via Gemini.

Pipeline: build_prompt → call_model → validate_html.
Funções privadas separadas pra teste unitário (mock só call_model).
"""

from __future__ import annotations

from typing import Any, Protocol

import google.generativeai as genai

from app.config import get_settings
from app.logging import get_logger
from app.models.brand import BrandKit, ThemeContext

logger = get_logger(__name__)

_MODEL_NAME = "gemini-flash-latest"
_MAX_OUTPUT_TOKENS = 16384
_MAX_ATTEMPTS = 2


class ModelClient(Protocol):
    """Abstração mínima de Gemini pra testes."""

    def generate(self, prompt: str) -> tuple[str, str | None]:
        """Retorna (texto, finish_reason)."""
        ...


class _GeminiClient:
    """Implementação real. Configura SDK e chama generate_content."""

    def __init__(self, api_key: str, model_name: str = _MODEL_NAME) -> None:
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY ausente no .env")
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel(model_name)
        self._config = genai.types.GenerationConfig(
            temperature=0.9,
            top_p=0.95,
            max_output_tokens=_MAX_OUTPUT_TOKENS,
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
    """Monta prompt determinístico. Pura, sem side-effect."""
    c = brand.colors
    occasion = theme.holiday_name or theme.theme.replace("_", " ")
    mood_line = f"Mood: {theme.mood}." if theme.mood else ""
    product_block = (
        f'Use esta foto de produto como hero: <img src="{theme.product_image_data_uri}">. '
        "Componha o layout em torno dela com sombras suaves e contraste forte."
        if theme.product_image_data_uri
        else "Sem foto de produto. Crie composição visual com formas geométricas, "
        "ícone de óculos minimalista em SVG inline, ou tipografia grande como protagonista."
    )

    return f"""Você é designer sênior de social media para ótica premium brasileira.

Gere UM arquivo HTML completo (com `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`) que renderiza um post Instagram quadrado 1080x1080 pixels.

REGRAS RÍGIDAS:
- Viewport fixo 1080x1080. Body sem scroll, sem margin, sem padding.
- Todo CSS inline em `<style>` no `<head>`. ZERO links externos (sem Google Fonts, sem CDN).
- Use APENAS fontes do sistema: -apple-system, "Segoe UI", Roboto, Arial, sans-serif.
- Use SVG inline para ícones (sem emoji decorativo, sem font-awesome).
- O HTML deve renderizar PERFEITO no Chromium headless (Playwright).
- NÃO inclua nenhum texto fora do `<html>...</html>` na resposta. Sem markdown, sem comentários, sem "aqui está".
- CSS deve ser ENXUTO (máx ~80 linhas). Priorize body com conteúdo completo. NUNCA corte no meio.
- Sempre termine com `</body></html>` completo.

ANTI-INVENÇÃO (CRÍTICO — questão legal):
- NÃO invente nomes de pessoas, depoimentos atribuídos, dados de cliente, métricas, preços, percentuais.
- NÃO use frases tipo `"— Mariana S., cliente"`, `"João, 32 anos"`, `"95% dos clientes aprovam"`.
- Se o tema for depoimento, use linguagem genérica: "o olhar de quem confia em nós", "histórias que se repetem na loja", SEM atribuir nome ou citar pessoa específica.
- NÃO mencione preço, desconto numérico, prazo de entrega, garantia em meses — só o `business_name`, `instagram_handle` e tom de voz fornecidos.

ORTOGRAFIA pt-BR (atenção):
- "PERFORMANCE" tem R: PER-FOR-MANCE (errado: "perfomance").
- "EXCELÊNCIA" com Ê e cedilha (errado: "excelencia", "excelensia").
- "SOFISTICAÇÃO" com Ç (errado: "sofisticasao").
- "REQUINTE" (errado: "requinti", "rekinte").
- Use acentos pt-BR corretos: à, á, ã, é, ê, í, ó, ô, õ, ú, ç.

CONTEXTO DA MARCA:
- Nome: {brand.business_name}
- Handle Instagram: {brand.instagram_handle or "@otica"}
- Tom de voz: {brand.brand_voice}
- Paleta: primary={c.primary}, secondary={c.secondary}, accent={c.accent}, texto={c.text}, fundo={c.background}

TEMA DO POST:
- Ocasião: {occasion}
- {mood_line}

LAYOUT:
- {product_block}
- Headline curto (3-6 palavras) com tipografia bold, tamanho 80-110px.
- Subhead opcional (1 linha, 28-40px).
- CTA discreto rodapé (ex: "Agende seu exame" ou "Conheça a coleção").
- Logo/nome da marca como text-mark no canto (use {brand.business_name}, sem buscar imagem externa).
- Use brand_colors com hierarquia clara: fundo SEMPRE primary={c.primary}, accent={c.secondary} APENAS em destaques (headline word-of-emphasis, divider, CTA hover). Contraste alto pra legibilidade.
- Fundo NÃO deve ser claro/bege/branco — primary é a identidade visual da marca.

EVITE:
- Imagens externas (vai dar 404 no headless).
- Emojis decorativos no design.
- Texto longo que parece carrossel.
- Gradientes saturados tipo Canva genérico — buscar estética sofisticada, premium.

Retorne SOMENTE o HTML completo.
"""


def extract_html(raw: str) -> str:
    """Remove fences markdown e trailing fora do bloco HTML."""
    text = raw.strip()
    if text.startswith("```"):
        first_nl = text.find("\n")
        if first_nl != -1:
            text = text[first_nl + 1 :]
        if text.endswith("```"):
            text = text[: -3].rstrip()
    start = text.find("<!DOCTYPE")
    if start == -1:
        start = text.find("<html")
    if start > 0:
        text = text[start:]
    end = text.rfind("</html>")
    if end != -1:
        text = text[: end + len("</html>")]
    return text.strip()


def is_complete_html(html: str) -> bool:
    return "</body>" in html and "</html>" in html


def generate_post_html(
    *,
    brand: BrandKit,
    theme: ThemeContext,
    client: ModelClient | None = None,
) -> tuple[str, dict[str, Any]]:
    """Pipeline completa. Em teste, injeta `client` fake."""
    actual_client: ModelClient = client or _GeminiClient(get_settings().gemini_api_key)
    prompt = build_prompt(brand, theme)

    html = ""
    finish_reason: str | None = None
    attempt = 0
    while attempt < _MAX_ATTEMPTS:
        attempt += 1
        raw, finish_reason = actual_client.generate(prompt)
        html = extract_html(raw)
        if is_complete_html(html):
            break
        logger.warning(
            "template.incomplete_html",
            attempt=attempt,
            finish_reason=finish_reason,
            chars=len(html),
        )

    if not is_complete_html(html):
        raise RuntimeError(
            f"Gemini retornou HTML truncado após {attempt} tentativa(s) "
            f"(finish_reason={finish_reason}, chars={len(html)})"
        )

    meta = {
        "model": _MODEL_NAME,
        "theme": theme.theme,
        "mood": theme.mood,
        "holiday_name": theme.holiday_name,
        "has_product_image": theme.product_image_data_uri is not None,
        "prompt_chars": len(prompt),
        "html_chars": len(html),
        "attempts": attempt,
        "finish_reason": finish_reason,
    }
    logger.info("template.generated", **meta)
    return html, meta
