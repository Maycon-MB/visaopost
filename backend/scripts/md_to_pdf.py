"""Converte Markdown em PDF A4 via Chromium headless (Playwright).

Uso:
    python -m scripts.md_to_pdf entregas/INSTRUCOES_CLIENTE.md
    python -m scripts.md_to_pdf entregas/contrato-prestacao-servicos.md --saida /tmp/contrato.pdf

Sem --saida, grava ao lado do .md com a mesma base e extensão .pdf.

Existe porque documento que o cliente assina ou lê no celular não pode ir em
Markdown cru. Reaproveita o Chromium que a Fase 3 já instalou pro render de posts.
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

from markdown_it import MarkdownIt
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[2]

# Serifada no corpo porque o uso é leitura longa e impressão, não tela de app.
_CSS = """
@page { size: A4; margin: 20mm 18mm; }
* { box-sizing: border-box; }
body {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10.5pt;
  line-height: 1.6;
  color: #1a1a1a;
  margin: 0;
}
h1 {
  font-size: 19pt;
  margin: 0 0 4mm;
  padding-bottom: 3mm;
  border-bottom: 2px solid #C1750B;
  page-break-after: avoid;
}
h2 {
  font-size: 13.5pt;
  margin: 8mm 0 3mm;
  color: #03191E;
  page-break-after: avoid;
}
h3 { font-size: 11.5pt; margin: 6mm 0 2mm; page-break-after: avoid; }
p, li { orphans: 3; widows: 3; }
ul, ol { padding-left: 6mm; }
li { margin-bottom: 1.5mm; }
strong { color: #03191E; }
hr { border: none; border-top: 1px solid #d8d8d8; margin: 7mm 0; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 4mm 0;
  font-size: 9.5pt;
  page-break-inside: avoid;
}
th, td { border: 1px solid #ccc; padding: 2mm 3mm; text-align: left; vertical-align: top; }
th { background: #f4f0ea; font-weight: bold; }
code {
  font-family: Consolas, "Courier New", monospace;
  font-size: 9pt;
  background: #f4f4f4;
  padding: 0.4mm 1mm;
  border-radius: 2px;
}
pre {
  background: #f7f7f7;
  border-left: 3px solid #C1750B;
  padding: 3mm;
  overflow-x: auto;
  page-break-inside: avoid;
}
pre code { background: none; padding: 0; }
blockquote {
  margin: 4mm 0;
  padding: 2mm 4mm;
  border-left: 3px solid #C1750B;
  background: #faf7f2;
}
a { color: #03191E; text-decoration: none; }
"""


def render_html(markdown_text: str) -> str:
    md = MarkdownIt("commonmark", {"html": True}).enable("table").enable("strikethrough")
    return (
        "<!DOCTYPE html><html lang='pt-BR'><head><meta charset='utf-8'>"
        f"<style>{_CSS}</style></head><body>{md.render(markdown_text)}</body></html>"
    )


def _footer(rodape: str) -> str:
    """Rodapé com identificação e numeração. Num contrato assinado, saber que a
    página 3 de 7 não sumiu é o que torna o documento conferível."""
    return (
        '<div style="width:100%;font-family:Georgia,serif;font-size:7.5pt;'
        'color:#666;padding:0 18mm;display:flex;justify-content:space-between;">'
        f"<span>{rodape}</span>"
        '<span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>'
        "</div>"
    )


async def _to_pdf(html: str, destino: Path, rodape: str) -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html, wait_until="load")
        await page.pdf(
            path=str(destino),
            format="A4",
            print_background=True,
            display_header_footer=True,
            header_template="<div></div>",
            footer_template=_footer(rodape),
            margin={"top": "18mm", "bottom": "18mm", "left": "18mm", "right": "18mm"},
        )
        await browser.close()


def main() -> int:
    parser = argparse.ArgumentParser(description="Markdown → PDF A4")
    parser.add_argument("origem", help="caminho do .md (relativo à raiz do repo ou absoluto)")
    parser.add_argument("--saida", help="caminho do .pdf de saída")
    parser.add_argument("--rodape", default="VisaoPost", help="texto do canto esquerdo do rodapé")
    args = parser.parse_args()

    origem = Path(args.origem)
    if not origem.is_absolute():
        origem = ROOT / origem
    if not origem.is_file():
        print(f"erro: não encontrei {origem}", file=sys.stderr)
        return 1

    destino = Path(args.saida) if args.saida else origem.with_suffix(".pdf")
    if not destino.is_absolute():
        destino = ROOT / destino

    asyncio.run(_to_pdf(render_html(origem.read_text(encoding="utf-8")), destino, args.rodape))
    print(f"{destino.relative_to(ROOT)} ({destino.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
