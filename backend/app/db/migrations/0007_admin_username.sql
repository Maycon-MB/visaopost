-- 0007_admin_username.sql
-- Login do painel passa a aceitar nome de usuário OU email.
-- Idempotente. Postgres 17.

BEGIN;

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username text;

-- username único por tenant (quando preenchido).
CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_users_tenant_username
    ON admin_users(tenant_id, lower(username))
    WHERE username IS NOT NULL;

COMMIT;
