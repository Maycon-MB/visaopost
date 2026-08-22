"""Entrypoint do worker RQ. Roda como container/process separado em produção.

Uso:
    python -m app.workers.worker

Variáveis de ambiente:
    REDIS_URL (default redis://redis:6379/0 em Docker, redis://localhost:6379/0 dev).

Fase 5 = código pronto. Boot real do worker acontece na Fase 8 quando o VPS
tem Redis. Em dev local rodar Redis Memurai ou WSL pra testar manualmente.
"""

from __future__ import annotations

from rq import Connection, Worker

from app.logging import configure_logging, get_logger
from app.services.queue import DEFAULT_QUEUE_NAMES, get_redis_connection


def main() -> int:
    configure_logging()
    logger = get_logger(__name__)
    conn = get_redis_connection()
    logger.info("worker.starting", queues=list(DEFAULT_QUEUE_NAMES))
    with Connection(conn):
        worker = Worker(list(DEFAULT_QUEUE_NAMES))
        worker.work(with_scheduler=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
