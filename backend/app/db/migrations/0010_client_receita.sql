-- 0010_client_receita.sql
-- Adiciona receita ótica ao cadastro do cliente.
-- Estrutura: { longe: {od, oe}, perto: {od, oe}, lente, armacao, obs }
-- Cada olho: { esferico, cilindrico, eixo, dp, altura }
-- Idempotente. Postgres 17.

BEGIN;

ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS receita jsonb;

COMMIT;
