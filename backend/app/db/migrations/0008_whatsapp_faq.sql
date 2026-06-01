-- 0008_whatsapp_faq.sql
-- Regras/FAQ do bot de WhatsApp, separado de extra_instructions (que é regra do post).
-- Alimenta o atendente virtual (Fase 10a).
-- Idempotente. Postgres 17.

BEGIN;

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS whatsapp_faq text;

-- Telefone do admin pra tela de perfil (avisos de sistema).
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone text;

COMMIT;
