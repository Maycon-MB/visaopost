"""Testa Playwright pipeline com HTML fixo.

Marcado @slow porque sobe Chromium (~3s). CI pode pular com `-m "not slow"`.
"""

from __future__ import annotations

import pytest

from app.services.renderer import POST_HEIGHT, POST_WIDTH, render_html_to_jpeg

JPEG_SOI = b"\xff\xd8\xff"  # Start-Of-Image marker JPEG

MINIMAL_HTML = """<!DOCTYPE html><html><head><style>
body{margin:0;background:#0D3322;color:#D4AF37;font-family:Arial;
display:flex;align-items:center;justify-content:center;height:1080px;font-size:80px;}
</style></head><body>Teste</body></html>"""


@pytest.mark.asyncio
@pytest.mark.slow
async def test_render_html_produces_valid_jpeg() -> None:
    jpeg = await render_html_to_jpeg(MINIMAL_HTML)
    assert isinstance(jpeg, bytes)
    assert jpeg.startswith(JPEG_SOI), "header JPEG ausente"
    assert len(jpeg) > 1000, "JPEG suspeitamente pequeno"


@pytest.mark.asyncio
@pytest.mark.slow
async def test_render_dimensions_constants() -> None:
    assert POST_WIDTH == 1080
    assert POST_HEIGHT == 1080
    jpeg = await render_html_to_jpeg(MINIMAL_HTML, width=540, height=540, quality=70)
    assert jpeg.startswith(JPEG_SOI)
