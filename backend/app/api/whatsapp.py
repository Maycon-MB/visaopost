"""Endpoints do webhook WhatsApp Cloud API Meta.

GET  /webhook/whatsapp  — verificação de webhook (Meta faz challenge inicial)
POST /webhook/whatsapp  — mensagens inbound + status updates

Sem autenticação por token JWT — Meta assina o payload com HMAC-SHA256
usando `APP_SECRET`. Validação da assinatura em `_verify_signature`.
"""

from __future__ import annotations

import hashlib
import hmac
from typing import Any

from fastapi import APIRouter, HTTPException, Query, Request, Response

from app.config import get_settings
from app.logging import get_logger
from app.services.whatsapp import process_webhook

logger = get_logger(__name__)

router = APIRouter(tags=["whatsapp"])


@router.get("/webhook/whatsapp")
async def verify_webhook(
    hub_mode: str = Query(alias="hub.mode", default=""),
    hub_verify_token: str = Query(alias="hub.verify_token", default=""),
    hub_challenge: str = Query(alias="hub.challenge", default=""),
) -> Response:
    """Meta faz GET pra verificar webhook antes de começar a entregar eventos."""
    settings = get_settings()
    if hub_mode != "subscribe" or hub_verify_token != settings.whatsapp_verify_token:
        logger.warning("whatsapp.webhook_verify_failed", mode=hub_mode)
        raise HTTPException(status_code=403, detail="verify token inválido")
    logger.info("whatsapp.webhook_verified")
    return Response(content=hub_challenge, media_type="text/plain")


@router.post("/webhook/whatsapp", status_code=200)
async def receive_webhook(request: Request) -> dict[str, str]:
    """Recebe eventos do Meta: mensagens, status, leitura."""
    body = await request.body()
    _verify_signature(request, body)

    try:
        payload: dict[str, Any] = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="JSON inválido")

    # Meta espera 200 imediato — processa em background pra não timeout
    import asyncio
    asyncio.create_task(process_webhook(payload))

    return {"status": "ok"}


def _verify_signature(request: Request, body: bytes) -> None:
    """Valida assinatura HMAC-SHA256 do Meta. Ignora se APP_SECRET não configurado."""
    settings = get_settings()
    app_secret = getattr(settings, "whatsapp_app_secret", "")
    if not app_secret:
        return  # dev sem secret configurado

    signature_header = request.headers.get("x-hub-signature-256", "")
    if not signature_header.startswith("sha256="):
        raise HTTPException(status_code=401, detail="assinatura ausente")

    expected = hmac.new(
        app_secret.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(signature_header[7:], expected):
        raise HTTPException(status_code=401, detail="assinatura inválida")
