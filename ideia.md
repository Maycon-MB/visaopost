# VisaoPost — Ideia e Visão do Produto

## O que é

SaaS B2B de automação de presença digital para pequenos negócios.
O dono foca no negócio. O sistema cuida do Instagram, do WhatsApp e do site.

Piloto: Ótica Di Lorenzo (@otica.dilorenzo — 147 seguidores, 17 posts).

---

## O que o produto entrega

- **Instagram automático** — publica posts todo dia pela API oficial do Meta, sem o dono abrir o app
- **Imagem com identidade visual** — cada post é montado com logo, cores e personagem exclusivo do cliente. Nada de template genérico
- **Legenda com IA** — texto criado pelo Gemini considerando o dia, feriados, tom da marca e histórico de posts aprovados
- **E-mail de aprovação** — antes de publicar, o cliente vê a imagem e a legenda. Aprova ou reprova com um toque. Se ignorar, o sistema posta mesmo assim
- **Calendário de datas** — Carnaval, Dia das Mães, Black Friday, Semana da Visão — posts temáticos automáticos nas datas certas
- **Landing page profissional** — site do negócio do cliente com domínio próprio (Growth e Premium)
- **Google Meu Negócio** — cada post vai pro Instagram e pro Google ao mesmo tempo (Premium)
- **WhatsApp automático** — bot que responde clientes 24h: horário, endereço, preços, agendamento (Premium)
- **Relatório mensal** — seguidores ganhos, posts publicados, melhor post do mês

---

## Inteligência do sistema

### Geração de imagem
Templates HTML/CSS por tema → Playwright tira screenshot 1080x1080 → Pillow salva JPEG.
Resultado com qualidade de designer: Google Fonts, gradientes CSS, glassmorphism, tipografia moderna.

### Variação inteligente de layout (Fase 2)
A IA não decide só o texto — decide o layout. Para cada post o Gemini retorna qual template usar, posicionamento do texto, cor de destaque e mood. Com múltiplos templates por data comemorativa, o sistema nunca repete a mesma composição no mesmo feriado em anos consecutivos.

Cada data comemorativa terá 3+ templates distintos. O sistema verifica o histórico e escolhe um não usado recentemente.

### Aprendizado por aprovação
Posts aprovados pelo cliente viram exemplos para os próximos (few-shot no prompt do Gemini). Em 3 meses o conteúdo já reflete o gosto real do público daquele cliente.

---

## Infraestrutura (custo do produto)

| Serviço | Função | Custo |
|---|---|---|
| Hostinger VPS | Roda o código Python | ~R$40/mês (PIX) |
| Supabase | Banco de dados + imagens | R$0 (free tier) |
| Gemini | IA para legendas | R$0 (free tier) |
| Resend | E-mail de aprovação | R$0 (free tier) |
| Z-API | WhatsApp bot (Premium) | ~R$80/mês |
| Instagram Graph API | Publicação automática | R$0 (oficial Meta) |

Custo operacional inicial: **R$0** até escalar.
Z-API só é ativado quando o primeiro cliente Premium fechar — o setup dele paga.

---

## Por cliente (repassado no setup)

| Serviço | Função | Custo |
|---|---|---|
| Hostinger | Landing page + domínio | ~R$150-200/ano |

O cliente é dono do próprio domínio. Pago no setup, não sai do bolso do produto.

---

## Modelo de negócio

**Regra de ouro:** o cliente paga o setup via PIX antes de qualquer desenvolvimento.
Esse dinheiro financia os serviços necessários para ele. Zero risco financeiro.

| | Starter | Growth | Premium |
|---|---|---|---|
| Instagram automático | ✓ | ✓ | ✓ |
| Personagem exclusivo | ✓ | ✓ | ✓ |
| E-mail de aprovação | ✓ | ✓ | ✓ |
| Calendário comemorativo | ✓ | ✓ | ✓ |
| Landing page + domínio | — | ✓ | ✓ |
| Google Meu Negócio | — | ✓ | ✓ |
| Relatório mensal | — | ✓ | ✓ |
| WhatsApp bot | — | — | ✓ |
| **Setup** | **R$ 800** | **R$ 1.000** | **R$ 1.500** |
| **Mensalidade** | **R$ 97** | **R$ 197** | **R$ 297** |

Sem contrato de fidelidade. Cancela quando quiser.

---

## Financeiro pessoal

- MEI ativo
- Conta PJ Nubank + Inter (débito — aceito no Railway e Z-API via PIX)
- Supabase, Gemini e Resend: free tier, sem cartão
- Zero uso de cartão pessoal

---

## Stack técnica

- **Linguagem:** Python 3.13 (já dominado)
- **Backend:** FastAPI
- **Imagens:** Pillow (composição de camadas — sem IA generativa para imagens)
- **IA texto:** Gemini 2.0 Flash via google-generativeai
- **Banco de dados:** Supabase (PostgreSQL — SQL puro, sem ORM)
- **Armazenamento:** Supabase Storage
- **E-mail:** Resend
- **Agendamento:** APScheduler
- **Instagram:** Graph API oficial (Meta)
- **WhatsApp:** Z-API (MVP) → Meta Business API (escala)
- **Hospedagem:** Hostinger VPS (Docker)
- **Landing pages:** Hostinger
- **Sem React/Node.js na Fase 1** — aprovação via e-mail, sem painel web

---

## Melhor e pior caso

**Melhor caso:** Instagram Graph API aprovado, bot WhatsApp rodando, cliente vê resultado em 30 dias, vira case de sucesso e indica outros negócios locais.

**Pior caso:** Meta nega ou atrasa a aprovação do Instagram (o maior risco real do projeto, fora do controle). WhatsApp bane o número Z-API (raro, mas possível). Nesses casos, geração de imagem, legenda e e-mail de aprovação continuam funcionando normalmente — o coração do produto não depende de aprovação externa.

---

## Ordem de desenvolvimento

1. Schema SQL + seed do calendário BR → valida no Supabase
2. Motor de imagem (Pillow) → gera post local
3. Geração de legenda (Gemini) → retorna texto + hashtags
4. Calendário → retorna feriado correto por data
5. Agendador (APScheduler) → dispara no horário
6. E-mail de aprovação (Resend) → chega no celular, botões funcionam
7. Publicação no Instagram (Graph API) → posta em conta Business
8. Bot WhatsApp (Z-API) → apenas no plano Premium

---

## Situação atual

- Motor de geração de imagem funcionando (Pillow)
- Sistema de aprovação por e-mail testado e funcionando
- Calendário de datas estratégicas para ótica definido
- Apresentação HTML completa para pitch (apresentacao.html)
- Landing page da Ótica Di Lorenzo gerada (landing_dilorenzo.html)
- Pitch marcado: quarta-feira 22/04/2026 — Ótica Di Lorenzo

**O produto existe. Falta fechar o primeiro cliente.**
