-- 0003_seed_tenant_dilorenzo.sql
-- Tenant piloto: Otica Di Lorenzo. Brand kit placeholder.
-- Cliente entrega na Fase 9: logo PNG, paleta real, fotos oculos, tokens IG/WA.

BEGIN;

INSERT INTO tenants (
    slug,
    business_name,
    plan,
    instagram_handle,
    brand_logo_url,
    brand_colors,
    brand_voice,
    owner_email,
    owner_phone,
    timezone,
    is_active
) VALUES (
    'dilorenzo',
    'Otica Di Lorenzo',
    'premium',
    '@otica.dilorenzo',
    '/assets/dilorenzo/logo.png',
    jsonb_build_object(
        'primary',   '#0D3322',
        'secondary', '#D4AF37',
        'accent',    '#F5F1E8',
        'text',      '#1A1A1A',
        'background','#FFFFFF'
    ),
    'Elegante, sofisticado, proximo. Foco em saude visual + estilo. Trata cliente por voce, sem jargao tecnico. Destaca qualidade e atendimento personalizado. Sempre menciona agendamento facil. Evita gatilhos exagerados de urgencia.',
    'maycon.dev+dilorenzo@gmail.com',
    '+5500000000000',
    'America/Sao_Paulo',
    true
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
