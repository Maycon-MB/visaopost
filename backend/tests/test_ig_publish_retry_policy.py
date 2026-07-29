"""O job de publicação só pode devolver exceção ao RQ quando retentar faz sentido.

RQ está configurado com Retry(max=3). Se um bloqueio da Meta subir como exceção, o
worker bate 3x na conta restrita e escala a punição. Erro permanente tem que virar
retorno de status, não exceção.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any
from uuid import UUID, uuid4

import pytest

from app.db.repositories.posts import ApprovedPost
from app.services.instagram import (
    InstagramPermanentError,
    InstagramTransientError,
    MediaPublishResult,
)
from app.workers import tasks

POST_ID = UUID("22222222-2222-2222-2222-222222222222")


def _approved_post() -> ApprovedPost:
    return ApprovedPost(
        id=POST_ID,
        tenant_id=uuid4(),
        tenant_slug="dilorenzo",
        instagram_access_token="token-fake",
        instagram_business_account_id="17841400000000000",
        image_url="https://exemplo.com/post.jpg",
        caption="Legenda de teste",
        hashtags=["otica", "madureira"],
        scheduled_at=datetime(2026, 7, 29, 12, 0, tzinfo=UTC),
    )


class _FakeClient:
    """Cliente IG que sempre falha do jeito pedido."""

    def __init__(self, error: Exception) -> None:
        self._error = error
        self.calls = 0

    async def publish_photo(self, *, image_url: str, caption: str) -> MediaPublishResult:
        self.calls += 1
        raise self._error


@pytest.fixture
def wired(monkeypatch: pytest.MonkeyPatch) -> dict[str, Any]:
    """Isola o job: sem DB, sem rede. Só a política de erro sob teste."""
    state: dict[str, Any] = {"marked_posted": []}

    async def fake_noop() -> None:
        return None

    async def fake_list_approved_due(*, limit: int = 20) -> list[ApprovedPost]:
        return [_approved_post()]

    async def fake_mark_as_posted(post_id: UUID, *, instagram_post_id: str) -> None:
        state["marked_posted"].append(post_id)

    monkeypatch.setattr(tasks, "init_pool", fake_noop)
    monkeypatch.setattr(tasks, "close_pool", fake_noop)
    monkeypatch.setattr("app.db.repositories.posts.list_approved_due", fake_list_approved_due)
    monkeypatch.setattr("app.db.repositories.posts.mark_as_posted", fake_mark_as_posted)

    def install(error: Exception) -> _FakeClient:
        client = _FakeClient(error)
        monkeypatch.setattr(
            "app.services.instagram.get_instagram_client",
            lambda **kwargs: client,
        )
        state["client"] = client
        return client

    state["install"] = install
    return state


async def test_erro_permanente_nao_levanta_excecao(wired: dict[str, Any]) -> None:
    """Bloqueio de política não pode voltar pro RQ — senão ele retenta 3x."""
    wired["install"](InstagramPermanentError("account restricted", status_code=400, code=368))

    result = await tasks._run_ig_publish(POST_ID)

    assert result["status"] == "blocked"
    assert result["ig_error_code"] == 368
    assert result["retryable"] is False


async def test_erro_permanente_nao_marca_post_como_publicado(wired: dict[str, Any]) -> None:
    wired["install"](InstagramPermanentError("token dead", status_code=400, code=190))

    await tasks._run_ig_publish(POST_ID)

    assert wired["marked_posted"] == []


async def test_erro_transitorio_continua_levantando(wired: dict[str, Any]) -> None:
    """Instabilidade da Meta segue subindo pro RQ, que retenta — comportamento desejado."""
    wired["install"](InstagramTransientError("try again", status_code=500, code=2))

    with pytest.raises(InstagramTransientError):
        await tasks._run_ig_publish(POST_ID)


async def test_erro_inesperado_continua_levantando(wired: dict[str, Any]) -> None:
    """Bug nosso (não da Meta) não pode ser engolido em silêncio."""
    wired["install"](ValueError("bug interno"))

    with pytest.raises(ValueError):
        await tasks._run_ig_publish(POST_ID)
