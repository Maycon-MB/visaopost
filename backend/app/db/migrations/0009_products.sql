-- Fase 6f: catálogo de produtos da ótica
-- Dono sobe fotos pelo painel admin → aparecem no site público (Fase 7a).
-- image_url: dev = /api/products/images/{tenant_id}/{filename}; prod = URL Backblaze B2.

CREATE TABLE IF NOT EXISTS products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'Outros',
    description     TEXT,
    price_brl       NUMERIC(10, 2),
    image_url       TEXT,
    tags            TEXT[] NOT NULL DEFAULT '{}',
    position        INTEGER NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_tenant_pos
    ON products (tenant_id, position);
