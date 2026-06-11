"""Endpoints para Relatório Mensal.

GET  /reports/monthly?year=2026&month=6          → dados do mês (sem insights)
POST /reports/monthly/{year}/{month}/insights    → gera insights via Gemini
"""

from __future__ import annotations

import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.auth import current_tenant_id
from app.db.repositories.reports import get_monthly_report
from app.db.repositories.tenants import get_tenant_access
from app.logging import get_logger
from app.models.report import MonthlyReport
from app.services.report_insights import generate_insights

router = APIRouter(prefix="/reports", tags=["reports"])
logger = get_logger(__name__)

_CURRENT_YEAR = datetime.date.today().year


@router.get("/monthly", response_model=MonthlyReport)
async def monthly(
    year: int  = Query(default=datetime.date.today().year,  ge=2024, le=_CURRENT_YEAR + 1),
    month: int = Query(default=datetime.date.today().month, ge=1,    le=12),
    tenant_id: UUID = Depends(current_tenant_id),
) -> MonthlyReport:
    tenant = await get_tenant_access(tenant_id)
    business_name = tenant[2] if tenant else "Meu Negócio"
    return await get_monthly_report(tenant_id, year, month, business_name)


@router.post("/monthly/{year}/{month}/insights", response_model=MonthlyReport)
async def monthly_insights(
    year: int,
    month: int,
    tenant_id: UUID = Depends(current_tenant_id),
) -> MonthlyReport:
    if not (2024 <= year <= _CURRENT_YEAR + 1):
        raise HTTPException(status_code=422, detail="ano inválido")
    if not (1 <= month <= 12):
        raise HTTPException(status_code=422, detail="mês inválido")

    tenant = await get_tenant_access(tenant_id)
    business_name = tenant[2] if tenant else "Meu Negócio"
    report = await get_monthly_report(tenant_id, year, month, business_name)

    try:
        insights = generate_insights(report)
    except Exception as exc:
        logger.error("reports.insights_failed", error=str(exc))
        raise HTTPException(status_code=502, detail="Falha ao gerar insights. Tente novamente.") from exc

    report.insights = insights
    return report
