"""Publicação de posts e coleta de métricas via Instagram Graph API.

Flow de publicação (imagem):
  1. create_container → POST /{account_id}/media com image_url público + caption
  2. poll_container   → GET /{container_id} até status_code=FINISHED (max 60s)
  3. publish          → POST /{account_id}/media_publish com creation_id
  4. permalink        → GET /{media_id}?fields=permalink

Token e account_id vêm do .env (dev) ou da tabela tenants (multi-tenant prod).
Protocol `InstagramClient` pra testes injetarem fake sem tocar rede.
"""

from __future__ import annotations

import asyncio
from typing import Protocol

import httpx
from pydantic import BaseModel

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)

_GRAPH_BASE = "https://graph.facebook.com/v21.0"
_POLL_INTERVAL_S = 3
_POLL_MAX_ATTEMPTS = 20  # 60s total

# Códigos da Graph API que NUNCA devem ser retentados automaticamente.
# Referência: developers.facebook.com/docs/graph-api/guides/error-handling
_PERMANENT_CODES = frozenset(
    {
        3,  # capacidade/permissão ausente no app
        9,  # usuário limitado por política de publicação
        10,  # permissão não concedida
        200,  # permissão insuficiente
        190,  # token inválido, expirado ou revogado
        368,  # temporariamente bloqueado por violação de política
        4,  # cota do app estourada
        17,  # cota do usuário estourada
        32,  # cota da página estourada
        613,  # rate limit do endpoint
    }
)

# Instabilidade do lado da Meta: retentar é o comportamento correto.
_TRANSIENT_CODES = frozenset({1, 2})


class InstagramApiError(RuntimeError):
    """Erro da Graph API com contexto suficiente pra diagnóstico e recurso na Meta."""

    def __init__(
        self,
        message: str,
        *,
        status_code: int,
        code: int | None = None,
        subcode: int | None = None,
        fbtrace_id: str | None = None,
    ) -> None:
        super().__init__(f"IG API {status_code} (code={code}, subcode={subcode}): {message}")
        self.status_code = status_code
        self.code = code
        self.subcode = subcode
        self.fbtrace_id = fbtrace_id
        self.raw_message = message


class InstagramTransientError(InstagramApiError):
    """Falha passageira. Pode retentar."""


class InstagramPermanentError(InstagramApiError):
    """Bloqueio, cota estourada, token morto ou permissão ausente. NÃO retentar."""


class MediaPublishResult(BaseModel):
    media_id: str
    permalink: str | None = None


class PostMetrics(BaseModel):
    impressions: int = 0
    reach: int = 0
    likes: int = 0
    saved: int = 0
    comments: int = 0
    shares: int = 0


class InstagramClient(Protocol):
    async def publish_photo(self, *, image_url: str, caption: str) -> MediaPublishResult: ...
    async def get_metrics(self, media_id: str) -> PostMetrics: ...


class _GraphApiClient:
    def __init__(self, *, access_token: str, account_id: str) -> None:
        if not access_token:
            raise RuntimeError("IG_ACCESS_TOKEN ausente no .env")
        if not account_id:
            raise RuntimeError("IG_ACCOUNT_ID ausente no .env")
        self._token = access_token
        self._account_id = account_id

    async def publish_photo(self, *, image_url: str, caption: str) -> MediaPublishResult:
        async with httpx.AsyncClient(timeout=30.0) as client:
            container_id = await self._create_container(
                client, image_url=image_url, caption=caption
            )
            await self._wait_container(client, container_id)
            media_id = await self._publish_container(client, container_id)
            permalink = await self._get_permalink(client, media_id)
            return MediaPublishResult(media_id=media_id, permalink=permalink)

    async def _create_container(
        self, client: httpx.AsyncClient, *, image_url: str, caption: str
    ) -> str:
        resp = await client.post(
            f"{_GRAPH_BASE}/{self._account_id}/media",
            params={
                "image_url": image_url,
                "caption": caption,
                "access_token": self._token,
            },
        )
        _raise_for_ig_error(resp)
        container_id: str = resp.json()["id"]
        logger.info("ig_container_created", container_id=container_id)
        return container_id

    async def _wait_container(self, client: httpx.AsyncClient, container_id: str) -> None:
        for attempt in range(_POLL_MAX_ATTEMPTS):
            resp = await client.get(
                f"{_GRAPH_BASE}/{container_id}",
                params={"fields": "status_code,status", "access_token": self._token},
            )
            _raise_for_ig_error(resp)
            data = resp.json()
            status_code = data.get("status_code", "")
            logger.debug("ig_container_poll", attempt=attempt, status_code=status_code)
            if status_code == "FINISHED":
                return
            if status_code == "ERROR":
                raise RuntimeError(f"IG container error: {data.get('status', 'unknown')}")
            await asyncio.sleep(_POLL_INTERVAL_S)
        raise RuntimeError(f"IG container timeout após {_POLL_MAX_ATTEMPTS * _POLL_INTERVAL_S}s")

    async def _publish_container(self, client: httpx.AsyncClient, container_id: str) -> str:
        resp = await client.post(
            f"{_GRAPH_BASE}/{self._account_id}/media_publish",
            params={"creation_id": container_id, "access_token": self._token},
        )
        _raise_for_ig_error(resp)
        media_id: str = resp.json()["id"]
        logger.info("ig_published", media_id=media_id)
        return media_id

    async def _get_permalink(self, client: httpx.AsyncClient, media_id: str) -> str | None:
        try:
            resp = await client.get(
                f"{_GRAPH_BASE}/{media_id}",
                params={"fields": "permalink", "access_token": self._token},
            )
            _raise_for_ig_error(resp)
            return resp.json().get("permalink")
        except Exception as exc:
            logger.warning("ig_permalink_failed", error=str(exc))
            return None

    async def get_metrics(self, media_id: str) -> PostMetrics:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(
                f"{_GRAPH_BASE}/{media_id}/insights",
                params={
                    "metric": "impressions,reach,saved,likes,comments,shares",
                    "period": "lifetime",
                    "access_token": self._token,
                },
            )
            _raise_for_ig_error(resp)
            raw: dict[str, int] = {
                item["name"]: item["values"][0]["value"]
                for item in resp.json().get("data", [])
                if item.get("values")
            }
            return PostMetrics(
                impressions=raw.get("impressions", 0),
                reach=raw.get("reach", 0),
                likes=raw.get("likes", 0),
                saved=raw.get("saved", 0),
                comments=raw.get("comments", 0),
                shares=raw.get("shares", 0),
            )


def _raise_for_ig_error(resp: httpx.Response) -> None:
    """Levanta erro classificado se a Graph API retornou falha.

    Permanente vs transitório decide se o RQ vai retentar. A conta do cliente já foi
    restringida pela Meta antes: insistir contra bloqueio, cota estourada ou token
    morto escala a punição em vez de resolver.
    """
    if resp.status_code < 400:
        return

    code: int | None = None
    subcode: int | None = None
    fbtrace_id: str | None = None
    message = resp.text
    try:
        err = resp.json().get("error", {})
        message = err.get("message", resp.text)
        raw_code = err.get("code")
        code = int(raw_code) if raw_code is not None else None
        raw_subcode = err.get("error_subcode")
        subcode = int(raw_subcode) if raw_subcode is not None else None
        fbtrace_id = err.get("fbtrace_id")
    except Exception:  # corpo não-JSON (proxy, 502 de gateway, HTML de erro)
        pass

    kind = (
        InstagramTransientError
        if _is_transient(status_code=resp.status_code, code=code)
        else InstagramPermanentError
    )
    raise kind(
        message,
        status_code=resp.status_code,
        code=code,
        subcode=subcode,
        fbtrace_id=fbtrace_id,
    )


def _is_transient(*, status_code: int, code: int | None) -> bool:
    """Só é retentável o que tende a se resolver sozinho em minutos."""
    if code in _PERMANENT_CODES:
        return False
    if code in _TRANSIENT_CODES:
        return True
    # 5xx sem código conhecido = instabilidade da Meta, vale retentar.
    # 4xx desconhecido cai no default seguro: não retenta.
    return status_code >= 500


def get_instagram_client(
    *,
    access_token: str | None = None,
    account_id: str | None = None,
) -> _GraphApiClient:
    """Instancia cliente Graph API. Parâmetros sobrescrevem .env (multi-tenant)."""
    s = get_settings()
    return _GraphApiClient(
        access_token=access_token or s.instagram_access_token,
        account_id=account_id or s.instagram_business_account_id,
    )
