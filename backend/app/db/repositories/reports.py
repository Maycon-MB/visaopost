"""Queries para Relatório Mensal. Zero ORM, asyncpg puro."""

from __future__ import annotations

import datetime
from uuid import UUID

from app.db.pool import acquire
from app.models.report import MonthlyReport, ThemeStat


def _month_range(year: int, month: int) -> tuple[datetime.date, datetime.date]:
    start = datetime.date(year, month, 1)
    if month == 12:
        end = datetime.date(year + 1, 1, 1)
    else:
        end = datetime.date(year, month + 1, 1)
    return start, end


async def get_monthly_report(
    tenant_id: UUID,
    year: int,
    month: int,
    business_name: str,
) -> MonthlyReport:
    start, end = _month_range(year, month)

    async with acquire() as conn:
        # posts do mês
        post_row = await conn.fetchrow(
            """
            SELECT
                COUNT(*) FILTER (WHERE status = 'posted')            AS published,
                COUNT(*) FILTER (WHERE status = 'rejected')           AS rejected,
                COUNT(*)                                              AS total
            FROM posts
            WHERE tenant_id = $1
              AND scheduled_at >= $2
              AND scheduled_at <  $3
            """,
            tenant_id, start, end,
        )

        # temas mais usados (posts publicados)
        theme_rows = await conn.fetch(
            """
            SELECT theme, COUNT(*) AS cnt
            FROM posts
            WHERE tenant_id = $1
              AND scheduled_at >= $2
              AND scheduled_at <  $3
              AND status = 'posted'
              AND theme IS NOT NULL
            GROUP BY theme
            ORDER BY cnt DESC
            LIMIT 5
            """,
            tenant_id, start, end,
        )

        # clientes
        client_row = await conn.fetchrow(
            """
            SELECT
                COUNT(*) FILTER (WHERE status != 'opted_out')                             AS total_active,
                COUNT(*) FILTER (WHERE created_at >= $2 AND created_at < $3)              AS new_month,
                COUNT(*) FILTER (WHERE source = 'qr_balcao'
                                   AND created_at >= $2 AND created_at < $3)              AS from_qr,
                COUNT(*) FILTER (WHERE last_contacted_at >= $2
                                   AND last_contacted_at < $3)                            AS contacted
            FROM clients
            WHERE tenant_id = $1
            """,
            tenant_id, start, end,
        )

    published   = post_row["published"] or 0
    total_posts = post_row["total"] or 0
    rejected    = post_row["rejected"] or 0
    reviewed    = published + rejected
    approval_rate = round((published / reviewed * 100) if reviewed > 0 else 0.0, 1)

    top_themes = [ThemeStat(theme=r["theme"], count=r["cnt"]) for r in theme_rows]

    return MonthlyReport(
        year=year,
        month=month,
        business_name=business_name,
        posts_published=published,
        posts_total_month=total_posts,
        posts_approval_rate=approval_rate,
        top_themes=top_themes,
        clients_total_active=client_row["total_active"] or 0,
        clients_new_month=client_row["new_month"] or 0,
        clients_from_qr_month=client_row["from_qr"] or 0,
        clients_contacted_month=client_row["contacted"] or 0,
    )
