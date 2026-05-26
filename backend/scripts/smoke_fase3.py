"""Smoke test Fase 3: gera 5 posts diferentes pra Di Lorenzo.

Usa repositories + tipos Pydantic (mesmo path do /dev/preview).
"""

from __future__ import annotations

import asyncio
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.db.pool import close_pool, init_pool  # noqa: E402
from app.db.repositories.holidays import find_holiday_by_theme  # noqa: E402
from app.db.repositories.tenants import get_brand_kit  # noqa: E402
from app.models.brand import ThemeContext  # noqa: E402
from app.services.renderer import render_html_to_jpeg  # noqa: E402
from app.services.template_generator import generate_post_html  # noqa: E402

OUT_DIR = ROOT / "tmp" / "fase3"

THEMES = [
    ("visao_mundial", "Dia Mundial da Visao"),
    ("natal", "Natal"),
    ("pascoa", "Pascoa"),
    ("carnaval", "Carnaval"),
    ("black_friday", "Black Friday"),
]


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    await init_pool()
    try:
        brand = await get_brand_kit("dilorenzo")
        if brand is None:
            raise RuntimeError("tenant dilorenzo não existe. Rode seed 0003.")
        print(f"[i] tenant: {brand.business_name}")
        print(f"[i] paleta: {brand.colors.model_dump()}")
        print(f"[i] out:    {OUT_DIR}\n")

        for theme_key, holiday_label in THEMES:
            holiday = await find_holiday_by_theme(theme_key)
            ctx = ThemeContext(
                theme=theme_key,
                mood=holiday.mood if holiday else None,
                holiday_name=holiday.name if holiday else holiday_label,
            )

            t0 = time.perf_counter()
            print(f"[>>] tema={theme_key!r} ...")
            try:
                html, meta = generate_post_html(brand=brand, theme=ctx)
                (OUT_DIR / f"{theme_key}.html").write_text(html, encoding="utf-8")
                jpeg = await render_html_to_jpeg(html)
                (OUT_DIR / f"{theme_key}.jpg").write_bytes(jpeg)
                dt = time.perf_counter() - t0
                print(
                    f"[OK] {theme_key}: html={meta['html_chars']}ch  "
                    f"jpeg={len(jpeg)}B  attempts={meta['attempts']}  ({dt:.1f}s)"
                )
            except Exception as exc:
                print(f"[ERR] {theme_key}: {exc}")
    finally:
        await close_pool()


if __name__ == "__main__":
    asyncio.run(main())
