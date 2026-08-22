"""Modelos para Relatório Mensal."""

from __future__ import annotations

from pydantic import BaseModel


class ThemeStat(BaseModel):
    theme: str
    count: int


class PostMetricStat(BaseModel):
    post_id: str
    theme: str | None
    caption_preview: str
    reach: int
    likes: int
    saves: int


class MonthlyReport(BaseModel):
    year: int
    month: int
    business_name: str

    # conteúdo
    posts_published: int
    posts_total_month: int
    posts_approval_rate: float  # 0-100
    top_themes: list[ThemeStat]

    # métricas Instagram (metrics_instagram — vazio até publicação real, Fase 10a-ig)
    reach_total: int = 0
    engagement_avg: float = 0.0  # média de (likes+comments+saves+shares) por post
    top_posts_by_reach: list[PostMetricStat] = []

    # clientes
    clients_total_active: int
    clients_new_month: int
    clients_from_qr_month: int
    clients_contacted_month: int

    # insights gerados por IA (opcional — endpoint separado)
    insights: str | None = None
