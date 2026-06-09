"""Tira screenshots da tela /apresentacao."""
import asyncio
import sys
from playwright.async_api import async_playwright

URL_LOGIN = "http://localhost:5173/login"
URL_AP    = "http://localhost:5173/apresentacao"
OUT1      = sys.argv[1] if len(sys.argv) > 1 else "/tmp/ap1.png"
OUT2      = sys.argv[2] if len(sys.argv) > 2 else "/tmp/ap2.png"


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1194, "height": 834})

        # login
        await page.goto(URL_LOGIN)
        await page.wait_for_load_state("networkidle")
        await page.fill("input[type='text']", "admin")
        await page.fill("input[type='password']", "admin")
        await page.click("button[type='submit']")
        await page.wait_for_timeout(2500)

        # slide 3 (Haytek Smart — mais diferenciais)
        await page.goto(URL_AP)
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(1200)
        # clicar filtro Lentes
        await page.click("text=Lentes")
        await page.wait_for_timeout(400)
        # navegar pro 3o produto (Haytek Smart)
        next_btn = page.locator("button[aria-label='Próximo']")
        await next_btn.click(); await page.wait_for_timeout(350)
        await next_btn.click(); await page.wait_for_timeout(350)
        await page.screenshot(path=OUT1)
        print(f"slide 3 -> {OUT1}")

        # slide 5 (Haytek Pro ID — mais diferenciais)
        await next_btn.click(); await page.wait_for_timeout(350)
        await next_btn.click(); await page.wait_for_timeout(350)
        await page.screenshot(path=OUT2)
        print(f"slide 5 -> {OUT2}")

        await browser.close()


asyncio.run(main())
