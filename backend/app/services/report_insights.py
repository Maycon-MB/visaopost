"""Gera insights do relatório mensal via Gemini.

Recebe dados já calculados → gera 4 bullets em pt-BR.
Segue o mesmo padrão de caption.py / reel_generator.py.
"""

from __future__ import annotations

import calendar
from typing import Protocol

import google.generativeai as genai

from app.config import get_settings
from app.logging import get_logger
from app.models.report import MonthlyReport
from app.services._gemini_retry import call_with_backoff

logger = get_logger(__name__)

_MODEL_NAME = "gemini-flash-latest"
_MAX_OUTPUT_TOKENS = 1024

_MONTH_PT = {
    1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
    5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
    9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
}


class InsightsClient(Protocol):
    def generate(self, prompt: str) -> str: ...


class _GeminiInsightsClient:
    def __init__(self, api_key: str) -> None:
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY ausente no .env")
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel(_MODEL_NAME)
        self._config = genai.types.GenerationConfig(
            temperature=0.7,
            top_p=0.9,
            max_output_tokens=_MAX_OUTPUT_TOKENS,
        )

    def generate(self, prompt: str) -> str:
        response = call_with_backoff(
            lambda: self._model.generate_content(prompt, generation_config=self._config)
        )
        return response.text or ""


def build_insights_prompt(report: MonthlyReport) -> str:
    month_name = _MONTH_PT[report.month]
    themes_str = ", ".join(t.theme for t in report.top_themes) if report.top_themes else "não informado"

    return f"""Você é analista de marketing digital para pequenos negócios brasileiros.

Analise os dados abaixo de {month_name}/{report.year} para "{report.business_name}" e gere EXATAMENTE 4 insights em português do Brasil.

DADOS DO MÊS:
- Posts publicados: {report.posts_published}
- Total de posts no período: {report.posts_total_month}
- Taxa de aprovação de conteúdo: {report.posts_approval_rate}%
- Temas mais publicados: {themes_str}
- Clientes ativos na base: {report.clients_total_active}
- Novos clientes no mês: {report.clients_new_month}
- Novos clientes via QR balcão: {report.clients_from_qr_month}
- Clientes contactados (recall): {report.clients_contacted_month}

REGRAS:
- Escreva APENAS os 4 insights. Sem título, sem introdução, sem conclusão.
- Cada insight em uma linha separada. Comece cada linha com "•".
- Linguagem direta, encorajadora mas honesta. Sem exagero.
- Baseie-se SOMENTE nos dados fornecidos. NÃO invente métricas, comparações ou benchmarks.
- Se algum número for zero, mencione como oportunidade, não como falha.
- Máximo 30 palavras por insight.
- Use linguagem genérica (não mencione "ótica", "óculos" ou termos do setor — pode ser qualquer comércio).

Retorne apenas os 4 bullets, um por linha.
"""


def generate_insights(
    report: MonthlyReport,
    client: InsightsClient | None = None,
) -> str:
    actual_client: InsightsClient = client or _GeminiInsightsClient(get_settings().gemini_api_key)
    prompt = build_insights_prompt(report)
    raw = actual_client.generate(prompt)
    lines = [l.strip() for l in raw.strip().splitlines() if l.strip()]
    bullets = [l if l.startswith("•") else f"• {l}" for l in lines if l]
    result = "\n".join(bullets[:6])
    logger.info("report.insights_generated", month=report.month, year=report.year, lines=len(bullets))
    return result
