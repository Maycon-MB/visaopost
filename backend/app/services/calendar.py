"""Resolve tema do post para uma data.

Prioridade:
1. Lookup `holidays_br` → tema oficial (feriado, data ótica, comemorativo, sazonal).
2. Fallback orgânico → pool de 30 temas óticos rotacionado deterministicamente
   por `date.toordinal()`. Mood independente rotaciona em 4 valores.

Pool de 30 garante zero repetição de tema em janela ≤30 dias. Temas distintos
dos slugs de `holidays_br` para evitar colisão.
"""

from __future__ import annotations

from datetime import date as DateType

from app.db.repositories.holidays import get_holiday_by_date
from app.models.brand import ThemeContext

ORGANIC_POOL: tuple[str, ...] = (
    "dica_uso_diario",
    "protecao_uv",
    "exame_visao_anual",
    "estilo_quadrado",
    "estilo_redondo",
    "estilo_gatinho",
    "estilo_aviador",
    "estilo_acetato",
    "lentes_antirreflexo",
    "lentes_fotossensiveis",
    "lentes_multifocais",
    "lentes_azul",
    "saude_olho_seco",
    "saude_miopia_infantil",
    "saude_astigmatismo",
    "saude_presbiopia",
    "tendencia_oversize",
    "tendencia_minimalista",
    "tendencia_colorida",
    "cuidado_armacao",
    "cuidado_estojo",
    "cuidado_ajuste",
    "solar_grau",
    "solar_polarizado",
    "esporte_oculos",
    "crianca_primeira_armacao",
    "idoso_conforto",
    "garantia_loja",
    "colecao_novidade",
    "depoimento_cliente",
)

ORGANIC_MOODS: tuple[str, ...] = (
    "informativo",
    "aspiracional",
    "acolhedor",
    "urgente",
)


def organic_theme_for(target_date: DateType) -> tuple[str, str]:
    """Tema+mood determinístico para a data (sem consultar DB)."""
    ordinal = target_date.toordinal()
    theme = ORGANIC_POOL[ordinal % len(ORGANIC_POOL)]
    mood = ORGANIC_MOODS[ordinal % len(ORGANIC_MOODS)]
    return theme, mood


async def resolve_theme(target_date: DateType) -> ThemeContext:
    """Holiday se houver, senão pool orgânico rotacionado."""
    holiday = await get_holiday_by_date(target_date)
    if holiday is not None:
        return ThemeContext(
            theme=holiday.theme,
            mood=holiday.mood,
            holiday_name=holiday.name,
        )
    theme, mood = organic_theme_for(target_date)
    return ThemeContext(theme=theme, mood=mood)
