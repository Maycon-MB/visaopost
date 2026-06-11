import asyncio, sys
from playwright.async_api import async_playwright

OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/receita.png"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 900, "height": 900})
        await page.goto("http://localhost:5173/login")
        await page.wait_for_load_state("networkidle")
        await page.fill("input[type='text']", "admin")
        await page.fill("input[type='password']", "admin")
        await page.click("button[type='submit']")
        await page.wait_for_timeout(2500)
        await page.goto("http://localhost:5173/admin/clientes")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(800)
        await page.click("text=+ Cadastrar")
        await page.wait_for_timeout(400)
        await page.fill("input[placeholder='Maria das Graças']", "João Teste")
        await page.fill("input[placeholder*='99999']", "31999990000")
        await page.click("text=+ Mais detalhes")
        await page.wait_for_timeout(400)
        # scroll to receita section
        await page.evaluate("""
            const label = Array.from(document.querySelectorAll('.label-atelier')).find(el => el.textContent.includes('Receita'));
            if (label) label.scrollIntoView({ behavior: 'instant', block: 'start' });
        """)
        await page.wait_for_timeout(300)
        await page.screenshot(path=OUT)
        print(f"-> {OUT}")
        await browser.close()

asyncio.run(main())
