"""Mini smoke Fase 4: gera 5 posts pra Di Lorenzo, datas 2026-06-01..2026-06-05.

Uso pontual pra inspecionar qualidade (texto + imagem) antes de rodar smoke
completo de 30 dias. Salva JPEGs em backend/tmp/posts/ e relatório em
backend/tmp/fase4/quick.json.
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
import time
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.chdir(ROOT)

from app.db.pool import close_pool, init_pool  # noqa: E402
from app.services.post_generator import generate_post  # noqa: E402

START = date(2026, 6, 1)
DAYS = 5
TENANT = "dilorenzo"
OUT_DIR = ROOT / "tmp" / "posts"
SUMMARY_DIR = ROOT / "tmp" / "fase4"


async def main() -> int:
    SUMMARY_DIR.mkdir(parents=True, exist_ok=True)
    summary_path = SUMMARY_DIR / "quick.json"

    await init_pool()
    results: list[dict[str, object]] = []
    failures = 0

    print(f"[i] tenant: {TENANT}")
    print(f"[i] out:    {OUT_DIR}")
    print(f"[i] dias:   {DAYS} a partir de {START.isoformat()}\n")

    try:
        for i in range(DAYS):
            d = START + timedelta(days=i)
            t0 = time.perf_counter()
            try:
                post = await generate_post(
                    tenant_slug=TENANT,
                    target_date=d,
                    output_dir=OUT_DIR,
                )
                dt = time.perf_counter() - t0
                results.append(
                    {
                        "date": d.isoformat(),
                        "post_id": str(post.id),
                        "theme": post.theme,
                        "mood": post.mood,
                        "holiday_name": post.holiday_name,
                        "caption": post.caption,
                        "hashtags": post.hashtags,
                        "cta": post.cta,
                        "image_path": f"backend/tmp/posts/{post.id}.jpg",
                        "elapsed_s": round(dt, 2),
                    }
                )
                print(
                    f"[OK] {d} theme={post.theme:<28} mood={post.mood or '-':<14} "
                    f"holiday={post.holiday_name or '-':<28} ({dt:.1f}s)"
                )
                print(f"     caption: {post.caption[:90]}...")
                print(f"     cta:     {post.cta}")
                print(f"     img:     {post.image_url}\n")
            except Exception as exc:
                failures += 1
                print(f"[ERR] {d}: {type(exc).__name__}: {exc}\n")
                results.append({"date": d.isoformat(), "error": f"{type(exc).__name__}: {exc}"})
    finally:
        await close_pool()

    summary_path.write_text(
        json.dumps({"failures": failures, "results": results}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[i] relatório: {summary_path}")
    print(f"[i] {DAYS - failures}/{DAYS} ok")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
