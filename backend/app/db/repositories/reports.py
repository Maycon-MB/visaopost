"""Queries para Relatório Mensal. Zero ORM, asyncpg puro."""

from __future__ import annotations

import datetime
from uuid import UUID

from app.db.pool import acquire
from app.models.report import MonthlyReport, PostMetricStat, ThemeStat


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

        # métricas Instagram — último snapshot de cada post publicado no mês
        metrics_row = await conn.fetchrow(
            """
            SELECT
                COALESCE(SUM(m.reach), 0)                                       AS reach_total,
                COALESCE(AVG(m.likes + m.comments + m.saves + m.shares), 0.0)   AS engagement_avg
            FROM posts p
            JOIN LATERAL (
                SELECT * FROM metrics_instagram mi
                WHERE mi.post_id = p.id
                ORDER BY mi.snapshot_date DESC
                LIMIT 1
            ) m ON true
            WHERE p.tenant_id = $1
              AND p.scheduled_at >= $2
              AND p.scheduled_at <  $3
              AND p.status = 'posted'
            """,
            tenant_id, start, end,
        )

        top_metric_rows = await conn.fetch(
            """
            SELECT p.id, p.theme, p.caption, m.reach, m.likes, m.saves
            FROM posts p
            JOIN LATERAL (
                SELECT * FROM metrics_instagram mi
                WHERE mi.post_id = p.id
                ORDER BY mi.snapshot_date DESC
                LIMIT 1
            ) m ON true
            WHERE p.tenant_id = $1
              AND p.scheduled_at >= $2
              AND p.scheduled_at <  $3
              AND p.status = 'posted'
            ORDER BY m.reach DESC
            LIMIT 3
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

    top_posts_by_reach = [
        PostMetricStat(
            post_id=str(r["id"]),
            theme=r["theme"],
            caption_preview=(r["caption"] or "")[:80],
            reach=r["reach"],
            likes=r["likes"],
            saves=r["saves"],
        )
        for r in top_metric_rows
    ]

    return MonthlyReport(
        year=year,
        month=month,
        business_name=business_name,
        posts_published=published,
        posts_total_month=total_posts,
        posts_approval_rate=approval_rate,
        top_themes=top_themes,
        reach_total=metrics_row["reach_total"] or 0,
        engagement_avg=round(float(metrics_row["engagement_avg"] or 0.0), 1),
        top_posts_by_reach=top_posts_by_reach,
        clients_total_active=client_row["total_active"] or 0,
        clients_new_month=client_row["new_month"] or 0,
        clients_from_qr_month=client_row["from_qr"] or 0,
        clients_contacted_month=client_row["contacted"] or 0,
    )
