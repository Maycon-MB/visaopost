-- 0011_products_features.sql
-- Adiciona lista de diferenciais/bullet points ao produto.
-- Usado na tela de apresentação presencial (tablet) e no site público.
-- Idempotente. Postgres 17.

BEGIN;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}';

COMMIT;
