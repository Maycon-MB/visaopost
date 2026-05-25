-- 0001_initial.sql
-- Schema MVP. Multi-tenant. Toda tabela filtra por tenant_id (exceto holidays_br).
-- Postgres 17. gen_random_uuid() = built-in (sem extensao).

BEGIN;

-- =========================================================
-- tenants: clientes da plataforma (oticas)
-- =========================================================
CREATE TABLE tenants (
    id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                        text UNIQUE NOT NULL,
    business_name               text NOT NULL,
    plan                        text NOT NULL CHECK (plan IN ('starter','growth','premium')),
    instagram_handle            text,
    instagram_access_token      text,
    instagram_business_account_id text,
    whatsapp_phone_id           text,
    brand_logo_url              text,
    brand_colors                jsonb NOT NULL DEFAULT '{}'::jsonb,
    brand_voice                 text,
    owner_email                 text,
    owner_phone                 text,
    timezone                    text NOT NULL DEFAULT 'America/Sao_Paulo',
    is_active                   boolean NOT NULL DEFAULT true,
    created_at                  timestamptz NOT NULL DEFAULT now(),
    updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_active ON tenants(is_active) WHERE is_active = true;

-- =========================================================
-- assets: fotos do cliente (oculos, ambiente, equipe, logo)
-- =========================================================
CREATE TABLE assets (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type        text NOT NULL CHECK (type IN ('product','ambient','team','logo')),
    file_path   text NOT NULL,
    tags        text[] NOT NULL DEFAULT '{}',
    metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
    uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_assets_tenant ON assets(tenant_id);
CREATE INDEX idx_assets_tenant_type ON assets(tenant_id, type);
CREATE INDEX idx_assets_tags ON assets USING gin(tags);

-- =========================================================
-- posts: cada post gerado pela IA
-- =========================================================
CREATE TABLE posts (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    scheduled_at        timestamptz NOT NULL,
    status              text NOT NULL CHECK (status IN ('draft','pending_approval','approved','rejected','posted','failed')),
    image_url           text,
    caption             text,
    hashtags            text[] NOT NULL DEFAULT '{}',
    theme               text,
    mood                text,
    ai_prompt           jsonb NOT NULL DEFAULT '{}'::jsonb,
    ai_html             text,
    instagram_post_id   text,
    approval_token      text UNIQUE,
    approved_at         timestamptz,
    posted_at           timestamptz,
    rejection_reason    text,
    metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_tenant ON posts(tenant_id);
CREATE INDEX idx_posts_tenant_status ON posts(tenant_id, status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status IN ('approved','pending_approval');
CREATE INDEX idx_posts_approval_token ON posts(approval_token) WHERE approval_token IS NOT NULL;

-- =========================================================
-- clients: base de clientes da otica (recall WhatsApp)
-- =========================================================
CREATE TABLE clients (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name                text NOT NULL,
    phone               text NOT NULL,
    email               text,
    last_exam_date      date,
    last_contacted_at   timestamptz,
    status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active','opted_out','converted')),
    metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at          timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, phone)
);

CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_recall ON clients(tenant_id, last_exam_date) WHERE status = 'active';

-- =========================================================
-- holidays_br: calendario BR + datas oticas (compartilhado)
-- =========================================================
CREATE TABLE holidays_br (
    date        date PRIMARY KEY,
    name        text NOT NULL,
    category    text NOT NULL CHECK (category IN ('feriado_nacional','data_otica','comemorativo','sazonal')),
    theme       text NOT NULL,
    mood        text,
    notes       text
);

CREATE INDEX idx_holidays_category ON holidays_br(category);

-- =========================================================
-- conversations: historico bot WhatsApp
-- =========================================================
CREATE TABLE conversations (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    contact_phone   text NOT NULL,
    direction       text NOT NULL CHECK (direction IN ('inbound','outbound')),
    message         text NOT NULL,
    intent          text,
    handled_by      text NOT NULL CHECK (handled_by IN ('bot','human','unanswered')),
    metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_tenant_phone ON conversations(tenant_id, contact_phone, created_at DESC);
CREATE INDEX idx_conversations_unanswered ON conversations(tenant_id) WHERE handled_by = 'unanswered';

-- =========================================================
-- metrics_instagram: snapshot diario das metricas
-- =========================================================
CREATE TABLE metrics_instagram (
    tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    post_id         uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    snapshot_date   date NOT NULL,
    reach           int NOT NULL DEFAULT 0,
    impressions     int NOT NULL DEFAULT 0,
    likes           int NOT NULL DEFAULT 0,
    comments        int NOT NULL DEFAULT 0,
    saves           int NOT NULL DEFAULT 0,
    shares          int NOT NULL DEFAULT 0,
    profile_visits  int NOT NULL DEFAULT 0,
    raw             jsonb NOT NULL DEFAULT '{}'::jsonb,
    captured_at     timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, snapshot_date)
);

CREATE INDEX idx_metrics_tenant_date ON metrics_instagram(tenant_id, snapshot_date DESC);

-- =========================================================
-- trigger: auto-update updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
