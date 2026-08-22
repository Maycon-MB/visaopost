"""Gera 1 post pro tenant demo e dumpa em previews/YYYY-MM-DD/ na raiz do repo.

Rodado pelo workflow .github/workflows/daily-post.yml (cron diário GH Actions).
Sem VPS = sem cron de produção; este script + GH Actions servem como esteira
de demonstração até a Fase 8 ligar RQ no servidor.

Layout do output (commitado pelo workflow):
    previews/YYYY-MM-DD/
        post.jpg          1080x1080 JPEG
        metadata.json     {date, theme, mood, caption, hashtags, cta, ...}

Uso local:
    python -m scripts.generate_demo_post                  # data = hoje
    python -m scripts.generate_demo_post 2026-06-15       # data alvo
    TENANT_SLUG=dilorenzo python -m scripts.generate_demo_post
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
from datetime import UTC, datetime
from datetime import date as DateType
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))
# Pydantic Settings procura `.env` no CWD; mesma estratégia do smoke_fase4.
os.chdir(ROOT)

from app.db.pool import close_pool, init_pool  # noqa: E402
from app.logging import configure_logging, get_logger  # noqa: E402
from app.services.post_generator import TenantNotFound, generate_post  # noqa: E402

DEFAULT_TENANT = os.environ.get("TENANT_SLUG", "dilorenzo")
PREVIEWS_DIR = REPO_ROOT / "previews"


def _parse_target_date(argv: list[str]) -> DateType:
    if len(argv) > 1:
        return DateType.fromisoformat(argv[1])
    return DateType.today()


async def _run(target: DateType, tenant: str) -> int:
    configure_logging()
    logger = get_logger(__name__)

    day_dir = PREVIEWS_DIR / target.isoformat()
    day_dir.mkdir(parents=True, exist_ok=True)

    await init_pool()
    try:
        try:
            post = await generate_post(
                tenant_slug=tenant,
                target_date=target,
                output_dir=day_dir,
            )
        except TenantNotFound as exc:
            logger.error("demo.tenant_missing", tenant=tenant, error=str(exc))
            return 2
    finally:
        await close_pool()

    # Arquivo gerado por generate_post: {post.id}.jpg. Renomeia pra nome estável.
    src = day_dir / f"{post.id}.jpg"
    dst = day_dir / "post.jpg"
    if src.exists():
        if dst.exists():
            dst.unlink()
        src.rename(dst)

    metadata = {
        "generated_at": datetime.now(UTC).isoformat(),
        "tenant": tenant,
        "date": target.isoformat(),
        "post_id": str(post.id),
        "theme": post.theme,
        "mood": post.mood,
        "holiday_name": post.holiday_name,
        "caption": post.caption,
        "hashtags": post.hashtags,
        "cta": post.cta,
        "image": "post.jpg",
    }
    (day_dir / "metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    logger.info(
        "demo.post.generated",
        tenant=tenant,
        date=target.isoformat(),
        theme=post.theme,
        out_dir=str(day_dir),
    )
    print(f"[OK] {target} theme={post.theme} → {day_dir}")
    return 0


def main() -> int:
    target = _parse_target_date(sys.argv)
    tenant = DEFAULT_TENANT
    return asyncio.run(_run(target, tenant))


if __name__ == "__main__":
    raise SystemExit(main())
