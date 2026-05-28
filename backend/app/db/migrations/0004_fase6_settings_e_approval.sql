-- 0004_fase6_settings_e_approval.sql
-- Fase 6: campos de configuracao do dono (horarios, dias, instrucoes) +
-- feedback opcional na rejeicao/regeracao.
--
-- Idempotente (ADD COLUMN IF NOT EXISTS) — Postgres 17 OK.

BEGIN;

-- =========================================================
-- tenants: settings do dono editavel via PWA /settings
-- =========================================================
ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS send_hour          smallint NOT NULL DEFAULT 6
        CHECK (send_hour BETWEEN 0 AND 23),
    ADD COLUMN IF NOT EXISTS publish_hour       smallint NOT NULL DEFAULT 12
        CHECK (publish_hour BETWEEN 0 AND 23),
    -- ISO weekday: 1=segunda, 2=terca, ..., 7=domingo. Default seg-sab.
    ADD COLUMN IF NOT EXISTS active_weekdays    jsonb NOT NULL DEFAULT '[1,2,3,4,5,6]'::jsonb,
    ADD COLUMN IF NOT EXISTS extra_instructions text;

-- =========================================================
-- posts: feedback do dono quando rejeita ou pede regerar
-- =========================================================
ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS approval_feedback text,
    ADD COLUMN IF NOT EXISTS regenerate_count  int NOT NULL DEFAULT 0
        CHECK (regenerate_count >= 0);

COMMIT;
