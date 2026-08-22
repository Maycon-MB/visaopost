-- 0015_instagram_oauth.sql
-- Suporte a conexão Instagram via OAuth (Facebook Login for Business),
-- em vez do dono ter que copiar token manualmente do .env.

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS instagram_token_expires_at timestamptz,
    ADD COLUMN IF NOT EXISTS facebook_page_name         text;
