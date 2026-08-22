-- 0005_auth_admin_users.sql
-- Auth do painel do dono: usuarios administradores por tenant (owner + equipe) +
-- estado de assinatura no tenant pra controlar inadimplencia / cancelamento de contrato.
--
-- Cancelar contrato = setar tenants.subscription_status = 'suspended'/'canceled'.
-- Login bloqueia, dados NAO sao apagados.
--
-- Idempotente (IF NOT EXISTS). Postgres 17. gen_random_uuid() built-in.

BEGIN;

-- =========================================================
-- tenants: estado da assinatura (billing/contrato)
-- =========================================================
ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'active'
        CHECK (subscription_status IN ('active','past_due','suspended','canceled'));

-- =========================================================
-- admin_users: quem loga no painel. 1 owner + N staff por otica.
-- =========================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name          text NOT NULL,
    email         text NOT NULL,
    password_hash text,  -- null enquanto convite pendente (status='invited')
    role          text NOT NULL DEFAULT 'staff'
        CHECK (role IN ('owner','staff')),
    status        text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','invited','disabled')),
    last_login_at timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- Email unico DENTRO do tenant (mesmo email pode existir em oticas diferentes).
CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_users_tenant_email
    ON admin_users(tenant_id, lower(email));
CREATE INDEX IF NOT EXISTS idx_admin_users_tenant ON admin_users(tenant_id);

-- =========================================================
-- password_resets: tokens de "esqueci a senha", single-use.
-- Guarda so o HASH do token (o token cru vai no email, nunca no banco).
-- =========================================================
CREATE TABLE IF NOT EXISTS password_resets (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    used_at    timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token_hash);

COMMIT;
