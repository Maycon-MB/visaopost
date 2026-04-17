# VisaoPost — Mandatos Técnicos

## Contexto
SaaS B2B de automação de Instagram para pequenos negócios. Piloto: Ótica Di Lorenzo.
Arquitetura multi-tenant desde o início. Stack 100% free tier até 10 clientes.

## Stack obrigatória
- Backend: Python 3.13 + FastAPI
- Imagens: Pillow (composição de camadas — NÃO usar IA generativa para posts)
- IA texto: Gemini 2.0 Flash via `google-generativeai`
- DB: Supabase (PostgreSQL) — SQL puro, sem ORM
- Storage: Supabase Storage
- Email: Resend (NÃO usar Gmail SMTP em produção)
- Deploy: Docker + Hostinger VPS
- WhatsApp: Z-API (fase 1), Meta Business API (escala)

## Convenções de código
- Todo query filtra por `tenant_id` — sem exceção
- Imagens sempre 1080x1080px JPEG qualidade 90
- Variáveis de ambiente via `.env` — nunca hardcoded
- `.env` nunca commitado (ver .gitignore)
- Funções de serviço em `backend/app/services/`
- Endpoints em `backend/app/api/`

## O que NÃO fazer
- Não usar ORM (SQLAlchemy, etc) — SQL puro no Supabase
- Não instalar dependências sem atualizar `requirements.txt`
- Não criar painel admin na Fase 1 — usar Supabase dashboard
- Não subir assets de cliente no repositório
- Não commitar `post.jpg`, `approval.html` gerados, `_logo_b64.txt`
- Não usar WhatsApp pessoal — apenas número dedicado

## Ordem de desenvolvimento (Jack, o Estripador)
1. Schema SQL + seed calendário BR → valida no Supabase
2. `composer.py` (Pillow) → gera imagem local
3. `caption.py` (Gemini) → retorna legenda + hashtags
4. `calendar.py` → retorna feriado correto por data
5. `scheduler.py` (APScheduler) → dispara no horário
6. `email.py` (Resend) + página de aprovação hospedada
7. `instagram.py` (Graph API) → posta em conta Business
8. WhatsApp bot (Z-API) — apenas no plano Premium

## Planos do produto
- **Starter** R$97/mês + R$800 setup
- **Growth** R$197/mês + R$1.000 setup
- **Premium** R$297/mês + R$1.500 setup

## Sinal de pronto por fatia
Cada fatia tem teste manual antes de avançar. Regra de Beyoncé: corrigiu bug = escreve o teste.
