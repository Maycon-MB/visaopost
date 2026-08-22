"""Valida Playwright→JPEG sem chamar Gemini. HTML hardcoded simulando Di Lorenzo."""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.services.renderer import render_html_to_jpeg  # noqa: E402

OUT = ROOT / "tmp" / "fase3" / "renderer_only.jpg"

HTML = """<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1080px; height:1080px; overflow:hidden; }
body {
  font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  background: linear-gradient(135deg, #0D3322 0%, #1a4a2f 100%);
  color:#F5F1E8;
  display:flex; flex-direction:column; justify-content:space-between;
  padding: 80px 70px;
}
.brand { font-size: 22px; letter-spacing: 4px; text-transform:uppercase; color:#D4AF37; }
.headline { font-size: 96px; line-height:1.05; font-weight:800; max-width:920px; }
.headline em { color:#D4AF37; font-style:normal; }
.sub { font-size: 30px; margin-top: 28px; color:#F5F1E8cc; max-width:860px; line-height:1.4; }
.cta { display:inline-block; margin-top:36px; padding:18px 40px; background:#D4AF37; color:#0D3322;
       font-weight:700; font-size:24px; border-radius:48px; letter-spacing:1px;}
.handle { font-size:20px; color:#D4AF37; letter-spacing:2px; }
</style></head><body>
  <div class="brand">Ótica Di Lorenzo</div>
  <div>
    <div class="headline">Sua visão merece<br><em>excelência diária.</em></div>
    <div class="sub">Exames completos e uma curadoria premium de armações esperam por você.</div>
    <span class="cta">Agende seu exame</span>
  </div>
  <div class="handle">@otica.dilorenzo</div>
</body></html>"""


async def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    jpeg = await render_html_to_jpeg(HTML)
    OUT.write_bytes(jpeg)
    print(f"[OK] renderer.jpeg.bytes={len(jpeg)} -> {OUT}")


if __name__ == "__main__":
    asyncio.run(main())
