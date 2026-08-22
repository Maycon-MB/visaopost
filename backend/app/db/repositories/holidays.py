"""Queries da tabela `holidays_br`. Compartilhada (sem tenant_id)."""

from __future__ import annotations

from datetime import date as DateType

from app.db.pool import acquire
from app.models.brand import Holiday


async def get_holiday_by_date(target_date: DateType) -> Holiday | None:
    """Retorna feriado/data ótica/comemorativo na data exata.

    Fase 4 usa esse path pro orquestrador diário (data → tema).
    """
    async with acquire() as conn:
        row = await conn.fetchrow(
            "SELECT name, theme, mood, category FROM holidays_br WHERE date = $1",
            target_date,
        )
    return Holiday.model_validate(dict(row)) if row else None


async def find_holiday_by_theme(theme: str) -> Holiday | None:
    """Lookup por tema (qualquer ocorrência). Usado em /dev/preview.

    Nota: temas como 'carnaval' ocorrem em 2 datas → retorna a primeira
    por ordem cronológica (ORDER BY date). Determinístico.
    """
    async with acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT name, theme, mood, category
            FROM holidays_br
            WHERE theme = $1
            ORDER BY date
            LIMIT 1
            """,
            theme,
        )
    return Holiday.model_validate(dict(row)) if row else None
