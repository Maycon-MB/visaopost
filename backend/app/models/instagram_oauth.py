"""Tipos do fluxo OAuth Instagram (Facebook Login for Business)."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class ConnectedPage(BaseModel):
    """Facebook Page do usuário logado, com IG Business Account vinculado (se houver)."""

    page_id: str
    page_name: str
    page_access_token: str
    instagram_business_account_id: str | None = None


class InstagramConnectionStatus(BaseModel):
    connected: bool
    page_name: str | None = None
    instagram_business_account_id: str | None = None
    expires_at: datetime | None = None
    days_until_expiry: int | None = None
