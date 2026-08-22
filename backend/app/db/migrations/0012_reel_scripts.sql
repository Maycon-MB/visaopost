-- Migration 0012: tabela reel_scripts (Scripts para Reels de Autoridade)
-- Idempotente: CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS

CREATE TABLE IF NOT EXISTS reel_scripts (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tema        TEXT        NOT NULL,
    produto     TEXT,
    duracao_s   SMALLINT    NOT NULL DEFAULT 30,
    tom         TEXT        NOT NULL DEFAULT 'autoridade',
    hook        TEXT        NOT NULL,
    roteiro     TEXT        NOT NULL,
    legenda     TEXT        NOT NULL,
    hashtags    TEXT[]      NOT NULL DEFAULT '{}',
    cta_verbal  TEXT        NOT NULL,
    cta_legenda TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reel_scripts_tenant_created
    ON reel_scripts (tenant_id, created_at DESC);
