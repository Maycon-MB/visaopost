import asyncio, sys
from playwright.async_api import async_playwright

BASE = "https://maycon-mb.github.io/visaopost/app"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1194, "height": 834})

        # vai direto pro catalogo
        await page.goto(f"{BASE}/")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        await page.click("text=Catálogo")
        await page.wait_for_timeout(1000)

        # clica Apresentar
        await page.click("text=Apresentar")
        await page.wait_for_timeout(1500)
        await page.screenshot(path="C:/Users/MayconBruno/AppData/Local/Temp/ap_gh_tudo.png")
        print("screenshot tudo")

        # filtra Lentes
        await page.click("text=Lentes")
        await page.wait_for_timeout(600)
        await page.screenshot(path="C:/Users/MayconBruno/AppData/Local/Temp/ap_gh_lentes1.png")
        print("screenshot lentes 1")

        # navega pro 2o (Smart)
        await page.click("button[aria-label='Próximo']")
        await page.wait_for_timeout(400)
        await page.screenshot(path="C:/Users/MayconBruno/AppData/Local/Temp/ap_gh_lentes2.png")
        print("screenshot lentes 2")

        # navega pro 3o (Pro ID)
        await page.click("button[aria-label='Próximo']")
        await page.wait_for_timeout(400)
        await page.screenshot(path="C:/Users/MayconBruno/AppData/Local/Temp/ap_gh_lentes3.png")
        print("screenshot lentes 3")

        await browser.close()

asyncio.run(main())
