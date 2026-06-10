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
            container_id = await self._create_container(client, image_url=image_url, caption=caption)
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
    """Lança RuntimeError com mensagem legível se a Graph API retornou erro."""
    if resp.status_code >= 400:
        try:
            err = resp.json().get("error", {})
            msg = err.get("message", resp.text)
        except Exception:
            msg = resp.text
        raise RuntimeError(f"IG API {resp.status_code}: {msg}")


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
