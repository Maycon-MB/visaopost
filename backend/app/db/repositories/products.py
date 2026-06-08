"""Queries da tabela `products` — catálogo de produtos da ótica."""

from __future__ import annotations

from decimal import Decimal
from uuid import UUID

import asyncpg

from app.db.pool import acquire
from app.models.product import Product, ProductCreate, ProductUpdate

_COLS = "id, tenant_id, name, category, description, price_brl, image_url, tags, features, position, is_active, created_at"


def _row_to_product(row: asyncpg.Record) -> Product:
    price = row["price_brl"]
    return Product(
        id=row["id"],
        tenant_id=row["tenant_id"],
        name=row["name"],
        category=row["category"],
        description=row["description"],
        price_brl=float(price) if price is not None else None,
        image_url=row["image_url"],
        tags=list(row["tags"] or []),
        features=list(row["features"] or []),
        position=row["position"],
        is_active=row["is_active"],
        created_at=row["created_at"],
    )


async def list_products(tenant_id: UUID, include_inactive: bool = False) -> list[Product]:
    q = f"""
        SELECT {_COLS} FROM products
        WHERE tenant_id = $1 {"" if include_inactive else "AND is_active = TRUE"}
        ORDER BY position ASC, created_at ASC
    """
    async with acquire() as conn:
        rows = await conn.fetch(q, tenant_id)
    return [_row_to_product(r) for r in rows]


async def get_product(tenant_id: UUID, product_id: UUID) -> Product | None:
    q = f"SELECT {_COLS} FROM products WHERE id = $1 AND tenant_id = $2"
    async with acquire() as conn:
        row = await conn.fetchrow(q, product_id, tenant_id)
    return _row_to_product(row) if row else None


async def create_product(tenant_id: UUID, payload: ProductCreate) -> Product:
    q = f"""
        INSERT INTO products (tenant_id, name, category, description, price_brl, tags, features, position, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING {_COLS}
    """
    price = Decimal(str(payload.price_brl)) if payload.price_brl is not None else None
    async with acquire() as conn:
        row = await conn.fetchrow(
            q,
            tenant_id,
            payload.name,
            payload.category,
            payload.description,
            price,
            payload.tags,
            payload.features,
            payload.position,
            payload.is_active,
        )
    assert row is not None
    return _row_to_product(row)


async def update_product(tenant_id: UUID, product_id: UUID, patch: ProductUpdate) -> Product | None:
    sets: list[str] = []
    vals: list[object] = []
    i = 1

    def add(col: str, val: object) -> None:
        nonlocal i
        sets.append(f"{col} = ${i}")
        vals.append(val)
        i += 1

    if patch.name is not None:
        add("name", patch.name)
    if patch.category is not None:
        add("category", patch.category)
    if "description" in patch.model_fields_set:
        add("description", patch.description)
    if "price_brl" in patch.model_fields_set:
        add("price_brl", Decimal(str(patch.price_brl)) if patch.price_brl is not None else None)
    if patch.tags is not None:
        add("tags", patch.tags)
    if patch.features is not None:
        add("features", patch.features)
    if patch.position is not None:
        add("position", patch.position)
    if patch.is_active is not None:
        add("is_active", patch.is_active)

    if not sets:
        return await get_product(tenant_id, product_id)

    q = f"UPDATE products SET {', '.join(sets)} WHERE id = ${i} AND tenant_id = ${i+1} RETURNING {_COLS}"
    vals.extend([product_id, tenant_id])
    async with acquire() as conn:
        row = await conn.fetchrow(q, *vals)
    return _row_to_product(row) if row else None


async def set_product_image(tenant_id: UUID, product_id: UUID, image_url: str) -> Product | None:
    q = f"UPDATE products SET image_url = $1 WHERE id = $2 AND tenant_id = $3 RETURNING {_COLS}"
    async with acquire() as conn:
        row = await conn.fetchrow(q, image_url, product_id, tenant_id)
    return _row_to_product(row) if row else None


async def delete_product(tenant_id: UUID, product_id: UUID) -> bool:
    q = "DELETE FROM products WHERE id = $1 AND tenant_id = $2"
    async with acquire() as conn:
        result: str = await conn.execute(q, product_id, tenant_id)
    return result == "DELETE 1"
