"""Renderiza HTML em JPEG 1080x1080 via Playwright Chromium headless.

Saída padrão: bytes JPEG quality=90 (mandato CLAUDE.md).
"""

from __future__ import annotations

from playwright.async_api import async_playwright

from app.logging import get_logger

logger = get_logger(__name__)

POST_WIDTH = 1080
POST_HEIGHT = 1080
JPEG_QUALITY = 90


async def render_html_to_jpeg(
    html: str,
    *,
    width: int = POST_WIDTH,
    height: int = POST_HEIGHT,
    quality: int = JPEG_QUALITY,
) -> bytes:
    """HTML string → JPEG bytes via Chromium headless."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        try:
            context = await browser.new_context(
                viewport={"width": width, "height": height},
                device_scale_factor=1,
            )
            page = await context.new_page()
            await page.set_content(html, wait_until="networkidle", timeout=15000)
            jpeg = await page.screenshot(
                type="jpeg",
                quality=quality,
                clip={"x": 0, "y": 0, "width": width, "height": height},
                full_page=False,
            )
        finally:
            await browser.close()

    logger.info(
        "renderer.jpeg.created",
        bytes=len(jpeg),
        width=width,
        height=height,
        quality=quality,
    )
    return jpeg
