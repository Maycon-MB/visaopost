-- 0006_clients_crm_fields.sql
-- Expande clients pra um CRM de otica de verdade: o que importa pra recall,
-- aniversario, LGPD e personalizacao do atendimento.
--
-- consent_whatsapp = opt-in LGPD. Recall WhatsApp SO pode disparar com isso true.
--
-- Idempotente (ADD COLUMN IF NOT EXISTS). Postgres 17.

BEGIN;

ALTER TABLE clients
    -- LGPD: opt-in explicito pra contato WhatsApp + quando foi dado.
    ADD COLUMN IF NOT EXISTS consent_whatsapp        boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS consent_at              timestamptz,
    -- Aniversario: campanha de felicitacao + timing de oferta.
    ADD COLUMN IF NOT EXISTS birth_date              date,
    -- De onde veio o cliente (analise de canal + QR de balcao da Fase 7c).
    ADD COLUMN IF NOT EXISTS source                  text NOT NULL DEFAULT 'manual'
        CHECK (source IN ('manual','csv','qr_balcao','indicacao','instagram','site')),
    -- Dados oticos pra personalizar recall e recomendacao.
    ADD COLUMN IF NOT EXISTS health_plan             text,   -- convenio
    ADD COLUMN IF NOT EXISTS lens_type               text,   -- monofocal/multifocal/transitions...
    ADD COLUMN IF NOT EXISTS frame_brand             text,   -- armacao preferida
    -- Historico de compra (LTV + recall por ciclo de troca).
    ADD COLUMN IF NOT EXISTS last_purchase_date      date,
    ADD COLUMN IF NOT EXISTS last_purchase_value_brl numeric(10,2)
        CHECK (last_purchase_value_brl IS NULL OR last_purchase_value_brl >= 0),
    -- Proximo retorno sugerido (recall preciso, nao so "12 meses do exame").
    ADD COLUMN IF NOT EXISTS next_return_date        date,
    -- Bairro pra logistica de visita domiciliar (item 23 do pitch).
    ADD COLUMN IF NOT EXISTS neighborhood            text;

-- Recall por consentimento: quem pode receber e quando retorna.
CREATE INDEX IF NOT EXISTS idx_clients_recall_consent
    ON clients(tenant_id, next_return_date)
    WHERE status = 'active' AND consent_whatsapp = true;

-- Aniversariantes do mes (campanha mensal).
CREATE INDEX IF NOT EXISTS idx_clients_birthday
    ON clients(tenant_id, birth_date)
    WHERE birth_date IS NOT NULL;

COMMIT;
