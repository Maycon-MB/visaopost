"""Backoff exponencial para erros transientes do Gemini.

Free tier limita 15 req/min. Burst dispara `ResourceExhausted` (HTTP 429).
Paid tier raramente, mas `ServiceUnavailable` (503) e `DeadlineExceeded` (504)
acontecem em janela de manutenção. Helper isola política de retry de cada
service Gemini (caption, template_generator).

Sync (SDK google-generativeai é sync). Workers RQ rodam jobs sync, então
chamada bloqueante aqui não trava event loop nenhum.
"""

from __future__ import annotations

import random
import time
from collections.abc import Callable
from typing import TypeVar

from google.api_core import exceptions as gax

from app.logging import get_logger

T = TypeVar("T")
logger = get_logger(__name__)

# Erros transientes que valem retry. NÃO incluir InvalidArgument / PermissionDenied
# (problema de prompt ou API key — retry só queima cota).
RETRYABLE_ERRORS: tuple[type[BaseException], ...] = (
    gax.ResourceExhausted,
    gax.ServiceUnavailable,
    gax.DeadlineExceeded,
    gax.InternalServerError,
)

DEFAULT_MAX_ATTEMPTS = 5
DEFAULT_BASE_DELAY = 1.0
DEFAULT_MAX_DELAY = 32.0


def call_with_backoff(
    fn: Callable[[], T],
    *,
    max_attempts: int = DEFAULT_MAX_ATTEMPTS,
    base_delay: float = DEFAULT_BASE_DELAY,
    max_delay: float = DEFAULT_MAX_DELAY,
    sleep: Callable[[float], None] = time.sleep,
    rng: Callable[[], float] = random.random,
) -> T:
    """Executa `fn`. Em erro retryable, dorme `base * 2^(n-1) + jitter` e tenta de novo.

    Args:
        fn: callable sem argumento (use closure pra capturar params).
        max_attempts: total de tentativas (1ª + retries). Default 5 = ~31s pior caso.
        base_delay: delay inicial em segundos.
        max_delay: teto do delay base (jitter ainda soma em cima).
        sleep: injetável pra testes (passa lambda noop).
        rng: injetável pra testes (passa lambda: 0.0 pra delay determinístico).

    Raises:
        Última exceção capturada após esgotar tentativas, OU qualquer erro
        não-retryable na 1ª ocorrência.
    """
    last_exc: BaseException | None = None
    for attempt in range(1, max_attempts + 1):
        try:
            return fn()
        except RETRYABLE_ERRORS as exc:
            last_exc = exc
            if attempt >= max_attempts:
                logger.error(
                    "gemini.retry.exhausted",
                    attempt=attempt,
                    error_type=type(exc).__name__,
                    error=str(exc),
                )
                raise
            delay = min(max_delay, base_delay * (2 ** (attempt - 1)))
            sleep_for = delay + delay * 0.5 * rng()
            logger.warning(
                "gemini.retry.backoff",
                attempt=attempt,
                error_type=type(exc).__name__,
                sleep_s=round(sleep_for, 2),
            )
            sleep(sleep_for)
    # Inalcançável: loop sempre retorna ou raise. Mantém type-checker feliz.
    assert last_exc is not None
    raise last_exc
