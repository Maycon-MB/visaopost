-- 0002_seed_calendar_br.sql
-- Calendario BR 2026: feriados nacionais + datas oticas + comemorativos relevantes.
-- Fonte feriados moveis 2026: Carnaval 16-17/02, Sexta Paixao 03/04, Pascoa 05/04, Corpus Christi 04/06.
-- Datas oticas: Dia Mundial Visao (2a quinta outubro 2026 = 08/10), Mes da Visao = outubro.

BEGIN;

INSERT INTO holidays_br (date, name, category, theme, mood) VALUES
-- =========================================================
-- Feriados nacionais 2026
-- =========================================================
('2026-01-01', 'Confraternizacao Universal',         'feriado_nacional', 'ano_novo',           'inspiracional'),
('2026-02-16', 'Carnaval (segunda)',                  'feriado_nacional', 'carnaval',           'festivo'),
('2026-02-17', 'Carnaval (terca)',                    'feriado_nacional', 'carnaval',           'festivo'),
('2026-04-03', 'Sexta-feira da Paixao',               'feriado_nacional', 'pascoa',             'reflexivo'),
('2026-04-05', 'Pascoa',                              'feriado_nacional', 'pascoa',             'familia'),
('2026-04-21', 'Tiradentes',                          'feriado_nacional', 'civico',             'patriotico'),
('2026-05-01', 'Dia do Trabalhador',                  'feriado_nacional', 'trabalho',           'gratidao'),
('2026-06-04', 'Corpus Christi',                      'feriado_nacional', 'religioso',          'reflexivo'),
('2026-09-07', 'Independencia do Brasil',             'feriado_nacional', 'patria',             'patriotico'),
('2026-10-12', 'Dia das Criancas / N.S. Aparecida',   'feriado_nacional', 'criancas',           'familia'),
('2026-11-02', 'Finados',                             'feriado_nacional', 'memorial',           'reflexivo'),
('2026-11-15', 'Proclamacao da Republica',            'feriado_nacional', 'civico',             'patriotico'),
('2026-11-20', 'Dia da Consciencia Negra',            'feriado_nacional', 'consciencia',        'educacional'),
('2026-12-25', 'Natal',                               'feriado_nacional', 'natal',              'familia'),

-- =========================================================
-- Datas oticas e saude visual
-- =========================================================
('2026-04-07', 'Dia Mundial da Saude',                'data_otica',       'saude_geral',        'educacional'),
('2026-07-10', 'Dia Nacional da Saude Ocular',        'data_otica',       'saude_visual',       'educacional'),
('2026-08-25', 'Dia Nacional do Otico-Optometrista',  'data_otica',       'profissional',       'celebrativo'),
('2026-10-08', 'Dia Mundial da Visao',                'data_otica',       'visao_mundial',      'campanha'),
('2026-10-01', 'Inicio Mes da Visao',                 'data_otica',       'mes_visao',          'campanha'),
('2026-10-31', 'Fim Mes da Visao',                    'data_otica',       'mes_visao',          'campanha'),

-- =========================================================
-- Comemorativos com forte apelo comercial
-- =========================================================
('2026-02-14', 'Dia dos Namorados (internacional)',   'comemorativo',     'romance',            'romantico'),
('2026-03-08', 'Dia Internacional da Mulher',         'comemorativo',     'mulher',             'empoderamento'),
('2026-03-15', 'Dia do Consumidor',                   'comemorativo',     'consumidor',         'promocional'),
('2026-05-10', 'Dia das Maes',                        'comemorativo',     'maes',               'familia'),
('2026-06-12', 'Dia dos Namorados (Brasil)',          'comemorativo',     'namorados',          'romantico'),
('2026-07-20', 'Dia do Amigo',                        'comemorativo',     'amizade',            'celebrativo'),
('2026-08-09', 'Dia dos Pais',                        'comemorativo',     'pais',               'familia'),
('2026-09-15', 'Dia do Cliente',                      'comemorativo',     'cliente',            'gratidao'),
('2026-10-15', 'Dia do Professor',                    'comemorativo',     'professor',          'gratidao'),
('2026-11-27', 'Black Friday',                        'comemorativo',     'black_friday',       'promocional'),
('2026-12-31', 'Reveillon',                           'comemorativo',     'ano_novo',           'inspiracional'),

-- =========================================================
-- Sazonais (campanhas trimestre)
-- =========================================================
('2026-03-20', 'Inicio do Outono',                    'sazonal',          'outono',             'estetico'),
('2026-06-21', 'Inicio do Inverno',                   'sazonal',          'inverno',            'estetico'),
('2026-09-23', 'Inicio da Primavera',                 'sazonal',          'primavera',          'renovacao'),
('2026-12-21', 'Inicio do Verao',                     'sazonal',          'verao_oculos_sol',   'promocional')

ON CONFLICT (date) DO NOTHING;

COMMIT;
