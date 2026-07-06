"""Conexão do Instagram via Facebook Login for Business — sem o dono ter que
copiar token nenhum na mão.

Fluxo:
  GET  /auth/facebook/connect   (autenticado) → {"authorize_url": "..."}
  GET  /auth/facebook/callback  (público, Meta redireciona o browser aqui)
  POST /auth/facebook/select    (autenticado) → escolhe a Page quando há mais de 1
  GET  /auth/facebook/status    (autenticado) → estado da conexão
  POST /auth/facebook/test-post (autenticado) → publica imagem de teste

App em Development Mode: só usuários tester/admin do app conseguem logar até
passar por App Review da Meta.
"""

from __future__ import annotations

import io
from datetime import datetime
from pathlib import Path
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from PIL import Image, ImageDraw
from pydantic import BaseModel

from app.api.auth import current_tenant_id
from app.config import get_settings
from app.db.repositories.tenants import (
    get_instagram_connection_status,
    get_instagram_credentials,
    save_instagram_connection,
)
from app.logging import get_logger
from app.models.instagram_oauth import ConnectedPage, InstagramConnectionStatus
from app.services import instagram_oauth as oauth_svc
from app.services.instagram import get_instagram_client
from app.services.jwt import (
    InvalidOAuthState,
    sign_oauth_state,
    sign_page_selection,
    verify_oauth_state,
    verify_page_selection,
)

_POSTS_DIR = Path(__file__).resolve().parents[2] / "tmp" / "posts"

router = APIRouter(prefix="/auth/facebook", tags=["instagram-oauth"])
logger = get_logger(__name__)


class AuthorizeUrlResponse(BaseModel):
    authorize_url: str


class SelectPageRequest(BaseModel):
    selection_token: str
    page_id: str


@router.get("/connect", response_model=AuthorizeUrlResponse)
async def connect(tenant_id: UUID = Depends(current_tenant_id)) -> AuthorizeUrlResponse:
    """Devolve a URL do dialog de login do Facebook. Frontend navega o browser pra lá."""
    state = sign_oauth_state(tenant_id=tenant_id)
    return AuthorizeUrlResponse(authorize_url=oauth_svc.build_authorize_url(state))


@router.get("/callback")
async def callback(code: str, state: str) -> RedirectResponse:
    """Meta redireciona o browser aqui com `code` + `state` depois do login.

    Sem Bearer token disponível (é navegação de browser, não fetch autenticado)
    — por isso o tenant vem do `state` assinado gerado em `/connect`.
    """
    settings = get_settings()
    frontend_settings_url = f"{settings.frontend_url}/settings"

    try:
        tenant_id = verify_oauth_state(state)
    except InvalidOAuthState as exc:
        logger.warning("ig_oauth.invalid_state", error=str(exc))
        return RedirectResponse(f"{frontend_settings_url}?ig_error=invalid_state")

    try:
        short_token = await oauth_svc.exchange_code_for_user_token(code)
        long_token, expires_at = await oauth_svc.exchange_for_long_lived_token(short_token)
        pages = await oauth_svc.list_connected_pages(long_token)
    except oauth_svc.MetaOAuthError as exc:
        logger.error("ig_oauth.exchange_failed", tenant_id=str(tenant_id), error=str(exc))
        return RedirectResponse(f"{frontend_settings_url}?ig_error=meta_api_failed")

    if not pages:
        logger.warning("ig_oauth.no_pages_with_instagram", tenant_id=str(tenant_id))
        return RedirectResponse(f"{frontend_settings_url}?ig_error=no_pages")

    if len(pages) == 1:
        page = pages[0]
        await save_instagram_connection(
            tenant_id,
            access_token=page.page_access_token,
            business_account_id=page.instagram_business_account_id or "",
            page_name=page.page_name,
            expires_at=expires_at,
        )
        logger.info("ig_oauth.connected", tenant_id=str(tenant_id), page_name=page.page_name)
        return RedirectResponse(f"{frontend_settings_url}?ig_connected=1")

    # Mais de uma Page com IG vinculado — cliente escolhe no frontend.
    selection_token = sign_page_selection(
        tenant_id=tenant_id,
        pages=[
            {
                "page_id": p.page_id,
                "page_name": p.page_name,
                "page_access_token": p.page_access_token,
                "instagram_business_account_id": p.instagram_business_account_id,
                "expires_at": expires_at.isoformat(),
            }
            for p in pages
        ],
    )
    return RedirectResponse(f"{frontend_settings_url}?ig_select={selection_token}")


@router.get("/select-options")
async def select_options(
    selection_token: str,
    tenant_id: UUID = Depends(current_tenant_id),
) -> list[ConnectedPage]:
    """Frontend chama isso pra renderizar o seletor de Page (nomes, sem token na tela)."""
    try:
        pages = verify_page_selection(selection_token, tenant_id=tenant_id)
    except InvalidOAuthState as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return [ConnectedPage(**{k: v for k, v in p.items() if k != "expires_at"}) for p in pages]


@router.post("/select")
async def select_page(
    body: SelectPageRequest,
    tenant_id: UUID = Depends(current_tenant_id),
) -> InstagramConnectionStatus:
    try:
        pages = verify_page_selection(body.selection_token, tenant_id=tenant_id)
    except InvalidOAuthState as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    chosen = next((p for p in pages if p["page_id"] == body.page_id), None)
    if chosen is None:
        raise HTTPException(status_code=404, detail="page_id não está na seleção original")

    await save_instagram_connection(
        tenant_id,
        access_token=chosen["page_access_token"],
        business_account_id=chosen["instagram_business_account_id"] or "",
        page_name=chosen["page_name"],
        expires_at=datetime.fromisoformat(chosen["expires_at"]),
    )
    logger.info("ig_oauth.page_selected", tenant_id=str(tenant_id), page_name=chosen["page_name"])
    return await get_instagram_connection_status(tenant_id)


@router.get("/status", response_model=InstagramConnectionStatus)
async def status(tenant_id: UUID = Depends(current_tenant_id)) -> InstagramConnectionStatus:
    return await get_instagram_connection_status(tenant_id)


def _build_test_image() -> bytes:
    """Tela branca 1080x1080 com 'Teste' no centro — só pra confirmar que a
    ponte de publicação funciona, não é conteúdo real de post."""
    img = Image.new("RGB", (1080, 1080), "white")
    draw = ImageDraw.Draw(img)
    text = "Teste"
    bbox = draw.textbbox((0, 0), text)
    text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((1080 - text_w) / 2, (1080 - text_h) / 2), text, fill="black")

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


@router.post("/test-post")
async def test_post(tenant_id: UUID = Depends(current_tenant_id)) -> dict[str, object]:
    """Publica uma imagem de teste no Instagram conectado. Confirma que token +
    conta certa estão funcionando de ponta a ponta antes do cliente confiar
    no robô pra postar de verdade."""
    credentials = await get_instagram_credentials(tenant_id)
    if credentials is None:
        raise HTTPException(status_code=409, detail="Instagram ainda não conectado")
    access_token, account_id = credentials

    _POSTS_DIR.mkdir(parents=True, exist_ok=True)
    image_id = uuid4()
    (_POSTS_DIR / f"{image_id}.jpg").write_bytes(_build_test_image())

    settings = get_settings()
    image_url = f"{settings.api_base_url}/posts/{image_id}.jpg"

    try:
        client = get_instagram_client(access_token=access_token, account_id=account_id)
        result = await client.publish_photo(image_url=image_url, caption="Teste de conexão VisaoPost ✅")
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    logger.info("ig_oauth.test_post_ok", tenant_id=str(tenant_id), media_id=result.media_id)
    return {"status": "ok", "media_id": result.media_id, "permalink": result.permalink}
