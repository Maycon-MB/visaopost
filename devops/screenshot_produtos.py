import asyncio, sys
from playwright.async_api import async_playwright

OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/produtos.png"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1194, "height": 834})
        await page.goto("http://localhost:5173/login")
        await page.wait_for_load_state("networkidle")
        await page.fill("input[type='text']", "admin")
        await page.fill("input[type='password']", "admin")
        await page.click("button[type='submit']")
        await page.wait_for_timeout(2500)
        await page.goto("http://localhost:5173/admin/produtos")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(1200)
        await page.screenshot(path=OUT)
        print(f"-> {OUT}")
        await browser.close()

asyncio.run(main())
