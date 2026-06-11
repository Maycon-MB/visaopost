"""Modelos para Relatório Mensal."""

from __future__ import annotations

from pydantic import BaseModel


class ThemeStat(BaseModel):
    theme: str
    count: int


class MonthlyReport(BaseModel):
    year: int
    month: int
    business_name: str

    # conteúdo
    posts_published: int
    posts_total_month: int
    posts_approval_rate: float  # 0-100
    top_themes: list[ThemeStat]

    # clientes
    clients_total_active: int
    clients_new_month: int
    clients_from_qr_month: int
    clients_contacted_month: int

    # insights gerados por IA (opcional — endpoint separado)
    insights: str | None = None
