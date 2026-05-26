# Projeto — Mandatos Técnicos

## Contexto
SaaS B2B de automação de Instagram para óticas. Piloto: Ótica Di Lorenzo (Premium, pago).
Arquitetura multi-tenant desde o início. Stack consolidada num único VPS Hostinger.

## Stack obrigatória

### Backend
- Python 3.13 + FastAPI + Pydantic v2
- `asyncpg` (driver Postgres async)
- Playwright (Chromium headless) para render de imagem
- Pillow apenas para overlay final de logo/watermark
- RQ + Redis para fila de jobs (NÃO usar APScheduler em produção)

### Frontend
- PWA do dono da ótica: React 18 + Vite + Bootstrap 5
- Landing pública multi-tenant: Astro 5 + React (islands) + Tailwind CSS

### Banco e cache
- **Produção (VPS):** PostgreSQL 17. NÃO usar Supabase (consolidação).
- **Dev local:** PostgreSQL 16+ aceitável. Schema usa só recursos nativos desde Postgres 13 (`gen_random_uuid`, `jsonb`, arrays, `gin`, partial index, triggers plpgsql). Maycon tem PG 14 + 16 instalados Windows → usa o 16 nativo em dev.
- **Produção (VPS):** Redis 7.
- **Dev local:** Redis necessário a partir da Fase 5 (fila RQ). Antes disso (Fases 2-4), backend roda sem Redis.
- Backup: `pg_dump` cron diário → Backblaze B2 free 10GB

### IA
- Gemini 2.0 Flash via `google-generativeai` — texto (legenda + hashtags + HTML do post)
- Gemini 2.5 Flash Image (Nano Banana) — edita foto óculos do cliente
- NÃO usar IA generativa pura para produto da ótica (deve respeitar foto real do cliente)

### Integrações externas
- Email: Resend (NÃO usar Gmail SMTP em produção)
- WhatsApp: WhatsApp Cloud API direto da Meta (1000 conversas/mês grátis). Twilio como fallback se aprovação Meta Business travar.
- Instagram: Graph API oficial em conta Business
- DNS: Cloudflare grátis com proxy ativado (SSL + DDoS + cache)

### Deploy
- **Produção:** Docker + Docker Compose no VPS Hostinger Ubuntu 24.04, Nginx + Certbot Let's Encrypt, GitHub Actions deploy auto via SSH (estilo Paramiko).
- **Dev local:** sem Docker obrigatório. Estratégia padrão = Postgres 16 nativo + Python venv. Codespaces é alternativa cloud quando ambiente cliente travar (Playwright em RAM apertada, multi-PC, etc.). Docker Desktop local é último recurso (consome 4-8GB RAM idle no WSL2, repete setup em cada PC).
- Ver `PLANO.md` Fase 2 (rota dev nativa) e Fase 8 (migração para VPS).

## Convenções de código
- Todo query filtra por `tenant_id` — sem exceção
- Imagens sempre 1080x1080px JPEG qualidade 90 (WebP só na landing)
- Variáveis de ambiente via `.env` — nunca hardcoded
- `.env` nunca commitado (ver .gitignore)
- Funções de serviço em `backend/app/services/`
- Endpoints em `backend/app/api/`
- Logs estruturados via `structlog` com `tenant_id` em todo evento

## O que NÃO fazer
- Não usar ORM (SQLAlchemy, etc) — SQL puro
- Não instalar dependências sem atualizar `requirements.txt`
- Não criar painel admin na Fase 1 — acessar Postgres direto via `psql` ou DBeaver
- Não subir assets de cliente no repositório
- Não commitar `post.jpg`, `approval.html` gerados, `_logo_b64.txt`
- Não usar WhatsApp pessoal — apenas número dedicado Meta Business
- Não usar Supabase, Vercel, Cloudflare Pages, Railway — tudo consolidado no VPS Hostinger

## Estrutura de pastas
```
automacao_instagram/
├── backend/         FastAPI (api/, services/, models/, db/)
├── pwa/             React + Vite + Bootstrap (app do dono da ótica)
├── landing/         Astro + Tailwind (landing pública multi-tenant)
├── nginx/           Nginx config
├── docker-compose.yml
├── docker-compose.prod.yml
└── .github/workflows/deploy.yml
```

## Ordem de desenvolvimento (Jack, o Estripador)
Cada fatia tem teste manual antes de avançar. Regra de Beyoncé: corrigiu bug = escreve o teste.

1. Schema SQL + seed calendário BR → valida no Postgres local
2. `renderer.py` (Playwright + HTML/Jinja2) → gera imagem 1080x1080
3. `template_generator.py` (Gemini) → gera HTML do post baseado no contexto
4. `caption.py` (Gemini) → retorna legenda + hashtags
5. `calendar.py` → retorna tema/feriado correto por data
6. RQ worker + cron diário → orquestra geração
7. `email.py` (Resend) + PWA `/aprovar/{token}` (JWT magic link)
8. `instagram.py` (Graph API) → publica em conta Business
9. Landing Astro multi-tenant
10. Bot WhatsApp Cloud API + recall 12 meses (apenas Premium)
11. Dashboard métricas

## Planos do produto
- **Starter** R$97/mês + R$800 setup
- **Growth** R$197/mês + R$1.000 setup
- **Premium** R$297/mês + R$1.500 setup (cliente atual: Di Lorenzo)

## Sinal de pronto por fatia
Teste manual + cobre bug com teste automatizado se aparecer.
