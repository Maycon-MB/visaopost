"""Fluxo OAuth do Instagram via Facebook Login for Business.

Sem SDK Meta — httpx puro no Graph API, mesmo padrão de `services/instagram.py`.
App em Development Mode: só usuários cadastrados como tester/admin do app
conseguem completar o login até passar por App Review.

Fluxo:
  1. build_authorize_url(state)                    → URL do dialog de login
  2. exchange_code_for_user_token(code)             → user token curto (~1-2h)
  3. exchange_for_long_lived_token(short_token)     → user token longo (~60 dias)
  4. list_connected_pages(long_lived_user_token)    → Pages + IG Business Account de cada uma
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from urllib.parse import urlencode

import httpx
from pydantic import BaseModel

from app.config import get_settings
from app.logging import get_logger
from app.models.instagram_oauth import ConnectedPage

logger = get_logger(__name__)

_GRAPH_BASE = "https://graph.facebook.com/v21.0"

# pages_show_list é exigido pelo /me/accounts do fluxo OAuth — não confundir
# com o token fixo do .env (Fase antiga), que não precisava dele.
OAUTH_SCOPES = (
    "instagram_basic",
    "instagram_content_publish",
    "instagram_manage_insights",
    "pages_show_list",
    "pages_read_engagement",
)


class MetaOAuthError(Exception):
    """Erro de resposta do Graph API durante o fluxo OAuth."""


class _TokenResponse(BaseModel):
    access_token: str
    expires_in: int | None = None


def build_authorize_url(state: str) -> str:
    settings = get_settings()
    if not settings.meta_app_id:
        raise MetaOAuthError("META_APP_ID ausente no .env")
    params = {
        "client_id": settings.meta_app_id,
        "redirect_uri": settings.meta_oauth_redirect_uri,
        "state": state,
        "scope": ",".join(OAUTH_SCOPES),
        "response_type": "code",
    }
    return f"https://www.facebook.com/v21.0/dialog/oauth?{urlencode(params)}"


async def exchange_code_for_user_token(code: str) -> str:
    """Troca o `code` do redirect por um user access token de curta duração."""
    settings = get_settings()
    _require_app_credentials(settings)
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(
            f"{_GRAPH_BASE}/oauth/access_token",
            params={
                "client_id": settings.meta_app_id,
                "client_secret": settings.meta_app_secret,
                "redirect_uri": settings.meta_oauth_redirect_uri,
                "code": code,
            },
        )
    _raise_for_error(resp)
    return _TokenResponse.model_validate(resp.json()).access_token


async def exchange_for_long_lived_token(short_lived_token: str) -> tuple[str, datetime]:
    """Troca user token curto por um de longa duração (~60 dias).

    Retorna (token, expires_at). `expires_at` é estimativa a partir de
    `expires_in` — Meta não garante prazo exato, mas é a única informação
    disponível sem chamar /debug_token à parte.
    """
    settings = get_settings()
    _require_app_credentials(settings)
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(
            f"{_GRAPH_BASE}/oauth/access_token",
            params={
                "grant_type": "fb_exchange_token",
                "client_id": settings.meta_app_id,
                "client_secret": settings.meta_app_secret,
                "fb_exchange_token": short_lived_token,
            },
        )
    _raise_for_error(resp)
    parsed = _TokenResponse.model_validate(resp.json())
    expires_in = parsed.expires_in or (60 * 24 * 60 * 60)  # fallback: 60 dias
    expires_at = datetime.now(UTC) + timedelta(seconds=expires_in)
    return parsed.access_token, expires_at


async def list_connected_pages(long_lived_user_token: str) -> list[ConnectedPage]:
    """Lista Pages do usuário logado que têm Instagram Business Account vinculado.

    Pages sem IG vinculado são descartadas aqui — não servem pro robô postar.
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(
            f"{_GRAPH_BASE}/me/accounts",
            params={
                "fields": "id,name,access_token,instagram_business_account",
                "access_token": long_lived_user_token,
            },
        )
    _raise_for_error(resp)

    pages = []
    for item in resp.json().get("data", []):
        ig_account = item.get("instagram_business_account")
        if not ig_account:
            continue
        pages.append(
            ConnectedPage(
                page_id=item["id"],
                page_name=item["name"],
                page_access_token=item["access_token"],
                instagram_business_account_id=ig_account["id"],
            )
        )
    return pages


def _require_app_credentials(settings: object) -> None:
    if not getattr(settings, "meta_app_id", "") or not getattr(settings, "meta_app_secret", ""):
        raise MetaOAuthError("META_APP_ID / META_APP_SECRET ausentes no .env")


def _raise_for_error(resp: httpx.Response) -> None:
    if resp.status_code >= 400:
        try:
            err = resp.json().get("error", {})
            msg = err.get("message", resp.text)
        except Exception:
            msg = resp.text
        logger.error("meta_oauth.error", status_code=resp.status_code, message=msg)
        raise MetaOAuthError(f"Meta OAuth {resp.status_code}: {msg}")
