# Projeto — Mandatos Técnicos

## Contexto
SaaS B2B de automação de Instagram para óticas. Piloto: Ótica Di Lorenzo (plano Premium, pago).
Arquitetura multi-tenant desde o primeiro commit. Stack consolidada num único VPS Hostinger.

---

## Stack obrigatória

### Backend
- Python 3.13 + FastAPI + Pydantic v2
- `asyncpg` (driver Postgres assíncrono)
- Playwright (Chromium headless) para render de imagem
- Pillow apenas para overlay final de logo/watermark
- RQ + Redis para fila de jobs (NÃO usar APScheduler em produção — perde job em restart)

### Frontend
- PWA do dono da ótica: React 18 + Vite + Bootstrap 5
- Landing pública multi-tenant: Astro 5 + React (islands) + Tailwind CSS

### Banco e cache
- **Produção (VPS):** PostgreSQL 17. NÃO usar Supabase (consolidação no VPS).
- **Dev local:** PostgreSQL 16+ nativo Windows. Schema usa só recursos nativos desde Postgres 13 (`gen_random_uuid`, `jsonb`, arrays, `gin`, partial index, triggers plpgsql).
- **Produção (VPS):** Redis 7.
- **Dev local:** Redis necessário a partir da Fase 5 (fila RQ). Antes disso (Fases 2-4), backend roda sem Redis.
- Backup: `pg_dump` cron diário → Backblaze B2 (free 10 GB).

### IA
- `gemini-flash-latest` via `google-generativeai` — texto (legenda, hashtags, HTML do post). Migrado de `gemini-2.0-flash` (quota free tier zerou em 2026).
- `gemini-2.5-flash-image` (Nano Banana) — edita foto óculos do cliente.
- NÃO usar IA generativa pura para o produto (deve sempre respeitar a foto real enviada pelo cliente).

### Integrações externas
- Email: Resend (NÃO usar Gmail SMTP em produção).
- WhatsApp: WhatsApp Cloud API direto da Meta (1000 conversas/mês grátis). Twilio é fallback se aprovação Meta Business travar.
- Instagram: Graph API oficial em conta Business.
- DNS: Cloudflare grátis com proxy ativado (SSL + DDoS + cache).

### Deploy
- **Produção:** Docker + Docker Compose no VPS Hostinger Ubuntu 24.04, Nginx + Certbot Let's Encrypt, GitHub Actions deploy via SSH.
- **Dev local:** sem Docker obrigatório. Estratégia padrão = Postgres 16 nativo + Python venv. Codespaces é alternativa cloud quando o ambiente cliente travar (Playwright em RAM apertada, multi-PC). Docker Desktop local é último recurso (consome 4-8 GB RAM idle no WSL2).
- Ver `PLANO.md` Fase 2 (rota dev nativa) e Fase 8 (migração para VPS).

---

## Convenções de código

### Estrutura
- Endpoints em `backend/app/api/`.
- Lógica de negócio em `backend/app/services/`.
- Queries SQL encapsuladas em `backend/app/db/repositories/` (uma função por consulta, uma por tabela). Nada de SQL inline em endpoint ou service.
- Tipos de domínio em `backend/app/models/` (Pydantic `BaseModel`, `frozen=True` para representações imutáveis de dados externos).
- Migrations SQL versionadas em `backend/app/db/migrations/NNNN_descricao.sql`. Sempre idempotentes (`ON CONFLICT DO NOTHING`, `CREATE TABLE IF NOT EXISTS` onde fizer sentido).

### Regras inegociáveis
- **Tenant isolation:** toda query filtra por `tenant_id`. Exceção única: `holidays_br` (compartilhada).
- **Imagens:** sempre 1080x1080 px JPEG qualidade 90. WebP só na landing pública.
- **SQL puro:** zero ORM. Performance, controle multi-tenant e clareza no plano de execução.
- **Segredos:** todas as credenciais via `.env`. Nunca hardcoded. `.env` nunca commitado (ver `.gitignore`).
- **Repositories devolvem tipos Pydantic** — `asyncpg.Record` nunca atravessa camadas.
- **Service expõe modelo agregado** (`BrandKit`, `ThemeContext`) em vez de N kwargs primitivos. Reduz signature explosion.
- **Validação na borda:** Pydantic valida dados que entram do DB ou da API. Erro silencioso vira `ValidationError` no boot, não bug em produção.
- **Logs estruturados** via `structlog`. Sempre incluir `tenant_id` no evento.
- **Dev endpoints gated:** rotas `/dev/*` só carregam se `APP_ENV == "dev"`.
- **Testabilidade via Protocol/DI:** dependências externas (Gemini, Resend, IG) abstraídas por `Protocol` para que testes injetem fake sem mock global.

---

## O que NÃO fazer
- Não usar ORM (SQLAlchemy, Tortoise, etc.).
- Não instalar dependências sem atualizar `requirements.txt`.
- Não criar painel admin na Fase 1 — acessar Postgres direto via `psql` ou DBeaver.
- Não subir assets de cliente (fotos óculos, logo, paleta) no repositório — vai pro VPS ou storage externo.
- Não commitar artefatos gerados: `post.jpg`, `approval.html`, `_logo_b64.txt`, `backend/tmp/`.
- Não usar WhatsApp pessoal — apenas número dedicado Meta Business.
- Não usar Supabase, Vercel, Cloudflare Pages, Railway — tudo consolidado no VPS Hostinger.

---

## Estrutura de pastas
```
automacao_instagram/
├── backend/                    ATIVO — SaaS produto (FastAPI + Gemini + Playwright)
│   ├── app/{api,services,models,workers,main.py}
│   ├── app/db/{migrations,repositories,pool.py}
│   ├── scripts/                smoke tests CLI
│   ├── tests/                  pytest (markers: slow, db)
│   └── requirements.txt
├── pitch/                      Apresentação institucional (React+Vite) — canal ATIVO de venda. Ver pitch/README.md.
├── docs/                       Build live do pitch/ — GitHub Pages: https://maycon-mb.github.io/visaopost/
├── legacy/                     Protótipo Python descontinuado.
├── pwa/                        (Fase 6) PWA aprovação cliente — React+Vite+Bootstrap 5. NÃO confundir com pitch/.
├── landing/                    (Fase 7) Landing multi-tenant — Astro+Tailwind
├── nginx/                      (Fase 8) configs prod
├── docker-compose.yml          dev local opcional
└── .github/workflows/          CI + deploy
```

---

## Ordem de desenvolvimento (entrega incremental)

Cada fatia tem teste manual antes de avançar. Bug encontrado vira teste automatizado antes de seguir adiante.

1. Schema SQL + seed calendário BR → valida no Postgres local
2. `renderer.py` (Playwright) → gera imagem 1080x1080 a partir de HTML
3. `template_generator.py` (Gemini) → gera HTML do post baseado no contexto
4. `caption.py` (Gemini) → retorna legenda + hashtags
5. `calendar.py` → retorna tema/feriado correto por data
6. RQ worker + cron diário → orquestra geração
7. `email.py` (Resend) + PWA `/aprovar/{token}` (JWT magic link)
8. `instagram.py` (Graph API) → publica em conta Business
9. Landing Astro multi-tenant
10. Bot WhatsApp Cloud API + recall 12 meses (apenas Premium)
11. Dashboard métricas

---

## Planos do produto
- **Starter** R$97/mês + R$800 setup
- **Growth** R$197/mês + R$1.000 setup
- **Premium** R$297/mês + R$1.500 setup (cliente atual: Di Lorenzo)

---

## Sinal de pronto por fatia
- Teste manual passou (geração ponta a ponta + render visual conferido).
- Pytest passa em `not slow and not db` sem warnings novos.
- Bug encontrado durante o teste manual virou teste automatizado antes de marcar a fatia como concluída.
- `PLANO.md` atualizado com status, aprendizados e próximo passo.

---

## Como testar (Fase 3 em diante)

```powershell
cd backend

# Unit + API (rápido, sem rede, sem DB)
.\.venv\Scripts\python.exe -m pytest -m "not slow and not db" -v

# Integração com Postgres (requer seed 0003)
.\.venv\Scripts\python.exe -m pytest -m "db" -v

# Playwright (sobe Chromium)
.\.venv\Scripts\python.exe -m pytest -m "slow" -v

# Smoke ponta a ponta (consome cota Gemini)
.\.venv\Scripts\python.exe scripts\smoke_fase3.py

# Servidor + endpoints dev
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
# → http://localhost:8000/dev/preview/natal
```
