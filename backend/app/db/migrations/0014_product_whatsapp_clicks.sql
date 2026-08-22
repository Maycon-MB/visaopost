-- 0014_product_whatsapp_clicks.sql
-- Contador de cliques em "Falar WhatsApp" por produto no catálogo público.
-- Sinal barato de interesse (qual produto atrai mais atenção), sem esperar
-- bot WhatsApp (Fase 10a-wa) nem Instagram real publicando.

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS whatsapp_click_count INTEGER NOT NULL DEFAULT 0;
