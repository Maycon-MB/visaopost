"""Seed produtos demo com features pra visualizar a tela Apresentacao."""
import asyncio
import os
import sys

sys.path.insert(0, ".")

from dotenv import load_dotenv

load_dotenv()

import asyncpg  # noqa: E402

DB = os.getenv("DATABASE_URL", "postgresql://postgres:teste@localhost:5433/visaopost")

PRODUCTS = [
    ("Haytek Go!", "Lentes", "Entrada de linha progressiva Freeform", None,
     ["Conforto e Nitidez", "Preço Acessível", "Fácil Adaptação"]),
    ("Haytek Light", "Lentes", "Progressiva intermediária com equilíbrio visual", None,
     ["Versatilidade", "Fácil Adaptação", "Equilíbrio entre os Campos"]),
    ("Haytek Smart", "Lentes", "Distribuição balanceada Freeform", None,
     ["Distribuição Balanceada", "Melhor Custo-Benefício", "Menor Distorção Periférica", "Efeito de Flutuação Reduzido"]),
    ("Haytek Top", "Lentes", "Alta performance com conforto superior", None,
     ["Conforto Superior", "Alta Tecnologia", "Maior Nitidez e Contraste", "Amplos Campos Visuais"]),
    ("Haytek Pro ID", "Lentes", "Tecnologia de ponta com personalização máxima", None,
     ["Tecnologia de Ponta", "Máxima Personalização", "Foco em Todas as Direções", "Visão Clara e Precisa", "Qualidade Inigualável"]),
    ("Aurora Tartaruga", "Solar", "Armação de acetato premium italiano", 890.0,
     ["Proteção UV 400", "Polarizado", "Leve e resistente"]),
    ("Classic Gold", "Grau", "Armação metálica dourada slim", 450.0,
     ["Titanium ultralight", "Dobradiças flexíveis", "Hipoalergênico"]),
]


async def main() -> None:
    conn = await asyncpg.connect(DB)
    row = await conn.fetchrow("SELECT id FROM tenants WHERE slug = $1", "dilorenzo")
    if not row:
        print("tenant dilorenzo not found")
        return
    tid = row["id"]

    count = await conn.fetchval("SELECT count(*) FROM products WHERE tenant_id = $1", tid)
    if count > 0:
        print(f"{count} produtos já existem — pulando seed")
        return

    for i, (name, cat, desc, price, feats) in enumerate(PRODUCTS):
        await conn.execute(
            """
            INSERT INTO products (tenant_id, name, category, description, price_brl, features, position, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, true)
            """,
            tid, name, cat, desc, price, feats, i,
        )
    print(f"seeded {len(PRODUCTS)} produtos demo")
    await conn.close()


asyncio.run(main())
