"""Classificação de erro da Graph API: o que pode ser retentado e o que não pode.

Motivo de existir: a conta do cliente já foi restringida pela Meta uma vez. Retentar
publicação contra conta bloqueada/sem permissão é o padrão que faz a Meta escalar de
restrição temporária pra permanente. Erro permanente tem que parar na primeira vez.
"""

from __future__ import annotations

from typing import Any

import httpx
import pytest

from app.services.instagram import (
    InstagramPermanentError,
    InstagramTransientError,
    _raise_for_ig_error,
)


def _resp(status: int, payload: dict[str, Any] | None = None) -> httpx.Response:
    request = httpx.Request("POST", "https://graph.facebook.com/v21.0/123/media")
    if payload is None:
        return httpx.Response(status, text="boom", request=request)
    return httpx.Response(status, json=payload, request=request)


def _error(code: int, *, subcode: int | None = None, message: str = "erro") -> dict[str, Any]:
    err: dict[str, Any] = {"code": code, "message": message, "fbtrace_id": "Abc123"}
    if subcode is not None:
        err["error_subcode"] = subcode
    return {"error": err}


def test_resposta_ok_nao_levanta() -> None:
    _raise_for_ig_error(_resp(200, {"id": "999"}))


def test_bloqueio_por_politica_e_permanente() -> None:
    """Code 368 = temporariamente bloqueado por violação de política. Nunca retentar."""
    with pytest.raises(InstagramPermanentError) as exc:
        _raise_for_ig_error(_resp(400, _error(368, message="temporarily blocked")))
    assert exc.value.code == 368


def test_token_invalido_e_permanente() -> None:
    """Code 190 = token expirado/revogado. Retentar não resolve, precisa reconectar."""
    with pytest.raises(InstagramPermanentError) as exc:
        _raise_for_ig_error(_resp(400, _error(190, subcode=463)))
    assert exc.value.code == 190
    assert exc.value.subcode == 463


@pytest.mark.parametrize("code", [4, 17, 32, 613])
def test_rate_limit_e_permanente_para_este_job(code: int) -> None:
    """Estouro de cota não pode ser retentado em 60s — só piora o throttle."""
    with pytest.raises(InstagramPermanentError):
        _raise_for_ig_error(_resp(400, _error(code)))


@pytest.mark.parametrize("code", [10, 200, 3])
def test_falta_de_permissao_e_permanente(code: int) -> None:
    with pytest.raises(InstagramPermanentError):
        _raise_for_ig_error(_resp(403, _error(code)))


def test_servico_indisponivel_e_transitorio() -> None:
    """Code 2 = falha temporária do lado da Meta. Retentar é correto."""
    with pytest.raises(InstagramTransientError):
        _raise_for_ig_error(_resp(500, _error(2)))


def test_erro_5xx_sem_json_e_transitorio() -> None:
    with pytest.raises(InstagramTransientError):
        _raise_for_ig_error(_resp(502))


def test_erro_4xx_desconhecido_e_permanente() -> None:
    """Default seguro: 4xx que não sabemos classificar não vira loop de retry."""
    with pytest.raises(InstagramPermanentError):
        _raise_for_ig_error(_resp(400, _error(999999)))


def test_erro_carrega_contexto_para_diagnostico() -> None:
    with pytest.raises(InstagramPermanentError) as exc:
        _raise_for_ig_error(_resp(400, _error(368, message="account restricted")))
    assert exc.value.status_code == 400
    assert exc.value.fbtrace_id == "Abc123"
    assert "account restricted" in str(exc.value)
