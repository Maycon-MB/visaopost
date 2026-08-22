"""Testa call_with_backoff: sucesso, retry transitorio, esgotamento, erro nao-retryable.

Não toca rede. Injeta sleep e rng pra delay determinístico.
"""

from __future__ import annotations

import pytest
from google.api_core import exceptions as gax

from app.services._gemini_retry import call_with_backoff


class _Counter:
    def __init__(self) -> None:
        self.calls = 0
        self.sleeps: list[float] = []

    def sleep(self, s: float) -> None:
        self.sleeps.append(s)


def _zero_rng() -> float:
    return 0.0


def test_sucesso_primeira_tentativa_nao_dorme() -> None:
    counter = _Counter()

    def fn() -> str:
        counter.calls += 1
        return "ok"

    out = call_with_backoff(fn, sleep=counter.sleep, rng=_zero_rng)
    assert out == "ok"
    assert counter.calls == 1
    assert counter.sleeps == []


def test_retry_apos_resource_exhausted_e_sucesso() -> None:
    counter = _Counter()
    states = iter(["fail", "ok"])

    def fn() -> str:
        counter.calls += 1
        if next(states) == "fail":
            raise gax.ResourceExhausted("429 quota burst")
        return "ok"

    out = call_with_backoff(
        fn,
        max_attempts=5,
        base_delay=1.0,
        sleep=counter.sleep,
        rng=_zero_rng,
    )
    assert out == "ok"
    assert counter.calls == 2
    # 1ª retry: delay = 1.0 * 2^0 = 1.0; jitter rng=0 → 0; total 1.0.
    assert counter.sleeps == [1.0]


def test_backoff_exponencial_deterministico() -> None:
    counter = _Counter()

    def fn() -> str:
        counter.calls += 1
        raise gax.ServiceUnavailable("503")

    with pytest.raises(gax.ServiceUnavailable):
        call_with_backoff(
            fn,
            max_attempts=4,
            base_delay=1.0,
            max_delay=32.0,
            sleep=counter.sleep,
            rng=_zero_rng,
        )
    assert counter.calls == 4
    # Delays: 1, 2, 4 (última tentativa não dorme antes do raise final).
    assert counter.sleeps == [1.0, 2.0, 4.0]


def test_max_delay_satura_backoff() -> None:
    counter = _Counter()

    def fn() -> str:
        counter.calls += 1
        raise gax.DeadlineExceeded("504")

    with pytest.raises(gax.DeadlineExceeded):
        call_with_backoff(
            fn,
            max_attempts=6,
            base_delay=10.0,
            max_delay=15.0,
            sleep=counter.sleep,
            rng=_zero_rng,
        )
    # Bases: 10, 20→clamp 15, 40→15, 80→15, 160→15. Total 5 sleeps.
    assert counter.sleeps == [10.0, 15.0, 15.0, 15.0, 15.0]


def test_erro_nao_retryable_propaga_imediato() -> None:
    counter = _Counter()

    def fn() -> str:
        counter.calls += 1
        raise gax.InvalidArgument("400 prompt malformado")

    with pytest.raises(gax.InvalidArgument):
        call_with_backoff(fn, sleep=counter.sleep, rng=_zero_rng)
    assert counter.calls == 1
    assert counter.sleeps == []


def test_jitter_soma_no_delay() -> None:
    counter = _Counter()

    def fn() -> str:
        counter.calls += 1
        raise gax.ResourceExhausted("429")

    with pytest.raises(gax.ResourceExhausted):
        call_with_backoff(
            fn,
            max_attempts=2,
            base_delay=4.0,
            sleep=counter.sleep,
            rng=lambda: 1.0,
        )
    # Delay = 4.0 + 4.0 * 0.5 * 1.0 = 6.0.
    assert counter.sleeps == [6.0]


def test_internal_server_error_eh_retryable() -> None:
    counter = _Counter()
    states = iter([True, False])

    def fn() -> str:
        counter.calls += 1
        if next(states):
            raise gax.InternalServerError("500")
        return "ok"

    out = call_with_backoff(fn, base_delay=0.1, sleep=counter.sleep, rng=_zero_rng)
    assert out == "ok"
    assert counter.calls == 2
