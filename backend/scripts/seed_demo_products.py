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
    ("ShineHD Easy", "Lentes", "Multifocal progressivo de entrada, qualidade visual até 50% melhor que progressivas convencionais", None,
     ["Visão natural e estável", "Fácil adaptação", "Bom custo-benefício"]),
    ("ShineHD Max", "Lentes", "Multifocal progressivo intermediário com tecnologia Analytics", None,
     ["Reduz flutuação até 40%", "Adaptação confortável", "Foco perfeito sem esforço"]),
    ("ShineHD Full AR", "Lentes", "Multifocal progressivo com tecnologia Analytics e antirreflexo na face interna da lente", None,
     ["Antirreflexo interno integrado", "Nitidez sem precedentes", "Fácil adaptação"]),
    ("ShineHD Premium", "Lentes", "Multifocal progressivo com tecnologia Extend Vision e Inteligência Artificial", None,
     ["Amplia todos os campos de visão", "Reduz fadiga ocular", "IA personalizada por usuário"]),
    ("ShineHD Top", "Lentes", "Multifocal progressivo de ponta com Inteligência Artificial, amplia campo de visão em até 60%", None,
     ["Campo de visão +60%", "Lente única e exclusiva por usuário", "Adaptação excelente"]),
    ("ShineHD Office", "Lentes", "Lente ocupacional com foco em intermediário e perto, alcance até 1,50m", None,
     ["Leitura confortável", "Visão estável em telas", "Postura natural no trabalho"]),
    ("ShineHD V.S Zen", "Lentes", "Lente de visão simples monofocal com tecnologia freeform de alta precisão", None,
     ["Visão ampla, foco rápido", "Menos distorção lateral", "Opção alto índice (mais fina)"]),
    ("Myojoy", "Lentes", "Lente infantil pra controle da progressão de miopia, indicada de 6 a 18 anos", None,
     ["504 microlentes de desfocagem periférica", "Desacelera avanço da miopia", "Policarbonato resistente a impacto"]),
    ("Tratamento Premium AR", "Lentes", "Camada de tratamento aplicável a qualquer lente: antirreflexo, antirrisco e hidrofóbico", None,
     ["Super antirreflexo", "Resistente a riscos e manchas", "Antiestático e hidrofóbico"]),
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
