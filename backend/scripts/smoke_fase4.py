"""Smoke Fase 4: gera 30 posts seguidos (2026-06-01 → 2026-06-30).

Valida:
- Zero exceção em ponta a ponta (brand→tema→copy→html→jpeg→DB).
- Zero repetição de tema na janela de 30 dias.
- JPEG persistido em backend/tmp/posts/.
- metadata.json com sumário (data, theme, mood, holiday_name, caption_preview).

Consome cota Gemini (60 chamadas: 30 caption + 30 HTML) + sobe Chromium 30x.
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
# Pydantic Settings procura `.env` no CWD. Smoke deve rodar a partir de backend/
# (mesma raiz onde mora o .env), independente de onde foi invocado.
os.chdir(ROOT)

from app.db.pool import close_pool, init_pool  # noqa: E402
from app.services.post_generator import generate_post  # noqa: E402

START = date(2026, 6, 1)
DAYS = 30
TENANT = "dilorenzo"
OUT_DIR = ROOT / "tmp" / "posts"
SUMMARY_DIR = ROOT / "tmp" / "fase4"


async def main() -> int:
    SUMMARY_DIR.mkdir(parents=True, exist_ok=True)
    summary_path = SUMMARY_DIR / "metadata.json"

    await init_pool()
    results: list[dict[str, object]] = []
    seen_themes: dict[str, list[str]] = {}
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
                seen_themes.setdefault(post.theme, []).append(d.isoformat())
                results.append(
                    {
                        "date": d.isoformat(),
                        "post_id": str(post.id),
                        "theme": post.theme,
                        "mood": post.mood,
                        "holiday_name": post.holiday_name,
                        "caption_preview": post.caption[:100],
                        "cta": post.cta,
                        "hashtag_count": len(post.hashtags),
                        "image_url": post.image_url,
                        "elapsed_s": round(dt, 2),
                    }
                )
                print(
                    f"[OK] {d} theme={post.theme:<28} mood={post.mood or '-':<14} "
                    f"holiday={post.holiday_name or '-':<28} ({dt:.1f}s)"
                )
            except Exception as exc:
                failures += 1
                print(f"[ERR] {d}: {type(exc).__name__}: {exc}")
                results.append({"date": d.isoformat(), "error": f"{type(exc).__name__}: {exc}"})
    finally:
        await close_pool()

    duplicates = {t: dates for t, dates in seen_themes.items() if len(dates) > 1}
    summary_payload = {
        "tenant": TENANT,
        "start": START.isoformat(),
        "days": DAYS,
        "failures": failures,
        "unique_themes": len(seen_themes),
        "duplicates": duplicates,
        "results": results,
    }
    summary_path.write_text(
        json.dumps(summary_payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print()
    print(f"[i] metadata: {summary_path}")
    print(f"[i] temas únicos: {len(seen_themes)} / {DAYS - failures} posts ok")
    if duplicates:
        print(f"[FAIL] repetição de tema detectada: {duplicates}")
        return 1
    if failures:
        print(f"[FAIL] {failures} dia(s) com erro")
        return 1
    print("[OK] 30 dias sem repetição, sem erro.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
