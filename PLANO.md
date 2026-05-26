# PLANO — Automação Instagram Di Lorenzo (Premium)

> Documento de contexto para retomar o projeto em uma nova sessão.
> Lê primeiro `CLAUDE.md` (mandatos técnicos) e este arquivo (plano de execução).

---

## Status Atual (2026-05-26)

✅ **Fase 0a** concluída — contas Gemini + Resend criadas, chaves em `backend/.env` (Bitwarden tem backup).
✅ **Fase 1** concluída — repo reorganizado (`backend/`, `pwa/`, `landing/`), FastAPI + Docker + CI prontos.
✅ **Fase 2** concluída + validada (2026-05-26) — schema aplicado no Postgres 16 nativo (porta 5433), seed 35 datas calendário 2026, tenant Di Lorenzo inserido, pool asyncpg conecta, `/health/db` retorna `{"status":"ok","tenants":1,"holidays":35}`. Bumps em `requirements.txt`: asyncpg 0.29.0 → 0.30.0 + pillow 10.4.0 → 11.0.0 (wheels Python 3.13).

### Decisão de ambiente dev (2026-05-26)

Maycon **NÃO** vai instalar Docker Desktop no PC. Razões:
- 2 PCs (alternância) → setup duplicado
- Docker Desktop consome 4-8GB RAM idle no WSL2 → estrangula Playwright na Fase 3+
- Já tem Postgres 14 + 16 nativo Windows + pgAdmin4 funcionando
- Schema do projeto usa só recursos nativos desde Postgres 13 → roda no 16 sem mudança

**Rota dev escolhida (zero Docker até Fase 5):**

| Fase | Componente | Onde roda em dev |
|---|---|---|
| 2 | Postgres + schema | Postgres 16 nativo Win (já instalado) |
| 3 | Playwright + Chromium | Python venv + `playwright install chromium` |
| 4 | Gemini API | venv + chamadas HTTP (zero infra) |
| 5 | RQ + Redis | **AQUI** decide: Codespaces OU WSL2 Redis OU fakeredis |
| 6 | Resend email | venv + HTTP (zero infra) |
| 7 | Landing Astro | `npm run dev` local |

Em produção (Fase 8), TUDO vira Docker no VPS Hostinger via Docker Compose. GitHub Actions deploya. Dev local sem Docker NÃO impede prod com Docker — `docker-compose.prod.yml` é arquivo separado, descrito na Fase 8.

⏭️ **Próximo:** Fase 3 (Gemini gera HTML do post + Playwright renderiza JPEG 1080x1080 + Nano Banana edita foto óculos).

---

## 1. Contexto de Negócio

**Produto**: SaaS B2B de automação de marketing para óticas.

**Cliente atual**: Ótica Di Lorenzo (@otica.dilorenzo). Pagou plano **Premium** (R$1.500 setup + R$297/mês). Aguardando início.

**Promessa Premium ao cliente**:
1. 1 post Instagram gerado por IA todo dia, aprovado em 1 clique pelo dono
2. Publicação automática no horário de pico
3. Notificação WhatsApp quando publica
4. Recall automático WhatsApp: clientes com 12+ meses sem exame
5. Bot WhatsApp atende dúvidas comuns 24/7
6. Posts temáticos automáticos em feriados e datas óticas (Dia da Visão, Carnaval, Black Friday etc.)
7. Landing page pública profissional com SEO local + Google Meu Negócio
8. Dashboard com métricas Instagram

**Custo operacional alvo**: ~R$33/mês por cliente. Margem ~89% no Premium.

---

## 2. Stack Técnica

### Linguagens
- Python 3.13 (backend)
- TypeScript/JSX (frontend)
- SQL puro (banco)

### Backend
- FastAPI + Pydantic v2
- asyncpg
- Playwright (render imagem HTML → JPEG)
- Pillow (overlay logo)
- RQ + Redis (fila + cron)

### Frontend
- **PWA cliente** (aprovação + dashboard): React 18 + Vite + Bootstrap 5
- **Landing pública** (multi-tenant): Astro 5 + React + Tailwind CSS

### Infra
- PostgreSQL 17 no VPS
- Redis no VPS
- Docker + Docker Compose
- Nginx + Let's Encrypt
- Hostinger VPS (Ubuntu 24.04)
- Cloudflare DNS (com proxy)
- GitHub Actions deploy via SSH

### Integrações
- Gemini 2.0 Flash (legenda + HTML do post)
- Gemini 2.5 Flash Image — Nano Banana (edita foto óculos)
- Instagram Graph API (publicar)
- WhatsApp Cloud API direto da Meta (bot + notificação) — Twilio é fallback
- Resend (email)

---

## 3. Arquitetura

### Modo PRODUÇÃO (após cliente confirmar) — tudo num VPS

```
[Internet]
    ↓
[Cloudflare DNS + Proxy]   ← SSL, DDoS, cache
    ↓
[Hostinger VPS — Ubuntu]
    ↓
[Nginx]
    ├── /api/*            → FastAPI (Python)
    ├── /app/*            → PWA React (build estático)
    └── /[cliente]        → Landing Astro (build estático)
                            ↓
                          [Postgres 17 + Redis]
                            ↓
                          [Gemini · WhatsApp Cloud · Instagram Graph · Resend]
```

Um SSH, um backup, um deploy.

### Modo DEV/DEMO atual (zero custo, sem cliente)

```
[Dev local — Docker Compose]
    ├── FastAPI (uvicorn)
    ├── Postgres 17
    ├── Redis
    └── RQ worker

[GitHub Pages]                           ← landing + PWA build estático
    ├── /dilorenzo                       ← landing pública demo
    ├── /app/aprovar/{token}             ← PWA aprovação (chama backend local via ngrok)
    └── /preview                         ← galeria posts gerados últimos 30 dias

[GitHub Actions cron 0 9 * * *]          ← roda 06h Brasília todo dia
    └── gera post Di Lorenzo → commita em /previews/ → GitHub Pages serve

[APIs externas free tier]
    └── Gemini · Resend (3k email/mês)
```

Substitui VPS+Nginx+RQ por GitHub Pages + GitHub Actions. Custo: R$0.

---

## 4. Estrutura do Repo

```
automacao_instagram/
├── backend/
│   ├── app/
│   │   ├── api/             endpoints FastAPI
│   │   ├── services/        lógica de negócio (gemini, instagram, whatsapp, render)
│   │   ├── models/          schemas Pydantic
│   │   ├── db/              queries SQL puras + migrations
│   │   ├── templates/       HTML Jinja2 (posts + emails + páginas)
│   │   ├── workers/         jobs RQ
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── pwa/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── landing/
│   ├── src/
│   ├── astro.config.mjs
│   └── package.json
├── nginx/
│   └── default.conf
├── docker-compose.yml          dev local
├── docker-compose.prod.yml     produção VPS
├── .github/workflows/deploy.yml
├── CLAUDE.md                   mandatos técnicos
├── PLANO.md                    este arquivo
└── README.md
```

---

## 5. Schema do Banco (MVP)

Toda tabela tem `tenant_id` exceto `holidays_br`.

```sql
-- tenants: clientes da plataforma (ótica)
tenants (
  id uuid primary key,
  slug text unique,                -- 'dilorenzo' (vira subdomínio)
  business_name text,
  plan text check (plan in ('starter','growth','premium')),
  instagram_handle text,
  instagram_access_token text,     -- Graph API
  whatsapp_phone_id text,          -- WhatsApp Cloud API
  brand_logo_url text,
  brand_colors jsonb,              -- {primary, secondary, accent}
  brand_voice text,                -- tom de voz pra Gemini
  created_at timestamptz default now()
)

-- assets: fotos enviadas pelo cliente (óculos, ambiente, equipe)
assets (
  id uuid primary key,
  tenant_id uuid references tenants(id),
  type text check (type in ('product','ambient','team','logo')),
  file_path text,
  tags text[],                     -- ['rayban','aviador','luxo']
  uploaded_at timestamptz default now()
)

-- posts: cada post gerado
posts (
  id uuid primary key,
  tenant_id uuid references tenants(id),
  scheduled_at timestamptz,
  status text check (status in ('draft','pending_approval','approved','rejected','posted','failed')),
  image_url text,
  caption text,
  hashtags text[],
  theme text,                      -- 'dia_da_visao', 'black_friday', 'organico'
  mood text,                       -- 'inspiracional', 'promocional', 'educacional'
  ai_prompt jsonb,                 -- contexto enviado ao Gemini
  ai_html text,                    -- HTML gerado pelo Gemini (render Playwright)
  instagram_post_id text,
  approval_token text unique,      -- JWT pro magic link
  approved_at timestamptz,
  posted_at timestamptz,
  metadata jsonb,
  created_at timestamptz default now()
)

-- clients: base de clientes da ótica (pro recall WhatsApp)
clients (
  id uuid primary key,
  tenant_id uuid references tenants(id),
  name text,
  phone text,
  last_exam_date date,
  last_contacted_at timestamptz,
  status text check (status in ('active','opted_out','converted')),
  metadata jsonb
)

-- holidays_br: calendário BR + datas óticas
holidays_br (
  date date primary key,
  name text,
  category text,                   -- 'feriado_nacional', 'data_otica', 'comemorativo'
  theme text                       -- usado pelo Gemini pra gerar post
)

-- conversations: histórico bot WhatsApp
conversations (
  id uuid primary key,
  tenant_id uuid references tenants(id),
  contact_phone text,
  direction text check (direction in ('inbound','outbound')),
  message text,
  intent text,                     -- 'preco', 'horario', 'agendamento', 'desconhecido'
  handled_by text check (handled_by in ('bot','human','unanswered')),
  created_at timestamptz default now()
)

-- metrics_instagram: snapshot diário das métricas
metrics_instagram (
  tenant_id uuid references tenants(id),
  post_id uuid references posts(id),
  snapshot_date date,
  reach int,
  impressions int,
  likes int,
  comments int,
  saves int,
  primary key (post_id, snapshot_date)
)
```

---

## 6. O que o cliente recebe (Premium)

### Automações (7)
1. Geração diária de post por IA
2. Agendamento horário pico
3. Publicação Instagram
4. Notificação WhatsApp ao publicar
5. Recall WhatsApp 12 meses
6. Bot WhatsApp dúvidas 24/7
7. Posts temáticos calendário BR

### Páginas públicas (1)
1. Landing page profissional `dilorenzo.visaopost.com.br` (ou domínio próprio do cliente)

### Páginas privadas do dono (PWA mobile-first)
1. Aprovação de post diário (`/aprovar/{token}`)
2. Dashboard de métricas
3. Agenda 30 dias dos próximos posts
4. Lista de recall (clientes a contatar)
5. Onboarding inicial

### Canais
1. Email diário com post para aprovar
2. WhatsApp confirmando publicação
3. WhatsApp alertando dúvida nova que bot não soube responder

---

## 7. Fluxo Operacional Diário (visão do cliente)

```
06h00 — Sistema lê calendário (ex: "Dia do Cliente")
06h05 — Gemini gera HTML do post + Nano Banana edita foto de óculos
06h08 — Playwright renderiza imagem 1080x1080
06h10 — Email com magic link cai no celular do dono
06h11 — Dono abre, clica "Aprovar" (ou "Pedir mudança" → ciclo recomeça)
12h00 — Sistema publica no Instagram
12h01 — WhatsApp do dono recebe: "Post publicado, link..."
24h    — Métricas snapshot vai pro dashboard
+12 meses sem exame → Cliente recebe WhatsApp de recall
A qualquer momento → Bot WhatsApp atende dúvidas
```

Dono faz 2 cliques por dia. Resto é automático.

---

## 8. Fases de Execução

> **MODO ATUAL: FREE TIER**. Cliente ainda não confirmou início. Não assinar nada pago (VPS, domínio próprio). Tudo roda local + GitHub Pages + GitHub Actions até cliente confirmar e liberar tokens. Fases marcadas com **[VPS]** só começam após confirmação do cliente.

### Fase 0a — Setup gratuito (faz agora, zero custo) ✅ CONCLUÍDA
- [x] Criar conta Google AI Studio + Gemini API key — chave salva em `backend/.env`
- [x] Criar conta Resend — chave salva em `backend/.env`
- [x] Conferir GitHub Pages habilitado no repo (já estava em `/docs`)
- [x] Conferir GitHub Actions habilitado
- [ ] (Opcional) Cloudflare grátis — adiado até ter domínio
- [x] Bitwarden: nota segura `visaopost-env` com cópia do `.env` (sync entre PCs)

### Fase 0b — Setup pago [VPS] (após cliente confirmar)
- [ ] Assinar VPS Hostinger (KVM 2 ou superior, ~R$30/mês) — pagamento via Pix/débito/boleto
- [ ] Comprar domínio (sugestão `visaopost.com.br` no Registro.br, ~R$40/ano)
- [ ] Cadastrar domínio no Cloudflare (DNS + proxy)
- [ ] Criar conta Backblaze B2 (backup free 10GB)

### Fase 1 — Foundation do código (1-2 dias) ✅ CONCLUÍDA
- [x] Reorganizar repo: criado `backend/`, movido `src/` → `pwa/`, criado `landing/` placeholder
- [x] `backend/requirements.txt` (FastAPI, asyncpg, Playwright, Gemini, RQ, Resend, structlog, pytest, ruff, mypy)
- [x] `backend/.env.example` com placeholders
- [x] `backend/Dockerfile` Python 3.13 + Playwright Chromium (imagem oficial)
- [x] `docker-compose.yml` dev (postgres17 + redis7 + backend + worker)
- [x] Pre-commit hooks (`.pre-commit-config.yaml` — ruff + ruff-format + mypy)
- [x] GitHub Actions CI (`.github/workflows/ci.yml` — backend lint+test + PWA build)
- [x] `backend/app/main.py` com `/health` + lifespan resiliente
- [x] `backend/app/config.py` (pydantic-settings)
- [x] `backend/app/logging.py` (structlog JSON)
- [x] `backend/tests/test_health.py`

### Fase 2 — Banco local (meio dia) ✅ CONCLUÍDA (código pronto, pendente teste manual no Postgres 16 nativo)
- [x] Migration `0001_initial.sql` — schema completo: tenants, assets, posts, clients, holidays_br, conversations, metrics_instagram + índices + trigger updated_at
- [x] Migration `0002_seed_calendar_br.sql` — 35 datas 2026 (feriados nacionais, datas óticas, comemorativos, sazonais)
- [x] Migration `0003_seed_tenant_dilorenzo.sql` — tenant piloto Di Lorenzo (brand kit placeholder)
- [x] `backend/app/db/pool.py` — pool asyncpg singleton + helpers `acquire()`, `init_pool()`, `close_pool()`
- [x] Endpoint `/health/db` retorna versão pg + contagens
- [x] Teste manual no Postgres 16 nativo Windows — `/health/db` retornou `tenants=1, holidays=35` em 2026-05-26 ✅

#### Passo a passo teste Fase 2 (rota Postgres nativo Win)

**Pré-requisitos:** Postgres 16 rodando (`Get-Service postgresql-x64-16` mostra `Running`), pgAdmin4 instalado, Python 3.13 instalado.

```powershell
# 1. Cria database visaopost no Postgres 16 (via psql ou pgAdmin GUI)
# Via psql:
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE visaopost;"
psql -U postgres -h localhost -p 5432 -c "CREATE USER visaopost WITH PASSWORD 'visaopost_dev';"
psql -U postgres -h localhost -p 5432 -c "GRANT ALL PRIVILEGES ON DATABASE visaopost TO visaopost;"

# 2. Aplica migrations em ordem
cd backend
psql -U visaopost -h localhost -d visaopost -f app/db/migrations/0001_initial.sql
psql -U visaopost -h localhost -d visaopost -f app/db/migrations/0002_seed_calendar_br.sql
psql -U visaopost -h localhost -d visaopost -f app/db/migrations/0003_seed_tenant_dilorenzo.sql

# 3. Verifica conteúdo
psql -U visaopost -h localhost -d visaopost -c "\dt"
psql -U visaopost -h localhost -d visaopost -c "SELECT count(*) FROM holidays_br;"  # esperado ~37
psql -U visaopost -h localhost -d visaopost -c "SELECT slug, plan FROM tenants;"     # esperado dilorenzo / premium

# 4. Sobe backend (venv)
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edita .env: DATABASE_URL=postgresql://visaopost:visaopost_dev@localhost:5432/visaopost
#             GEMINI_API_KEY=<do Bitwarden>
#             RESEND_API_KEY=<do Bitwarden>
uvicorn app.main:app --reload

# 5. Testa endpoint (outro PowerShell)
curl http://localhost:8000/health
curl http://localhost:8000/health/db
# /health/db deve retornar version PG16.x + tenants_count=1 + holidays_count=37
```

**Alternativa via pgAdmin4 GUI (sem psql CLI):**
1. Abre pgAdmin4 → conecta servidor Postgres 16 local
2. Click direito em "Databases" → Create → Database → nome `visaopost` → owner `postgres`
3. Click direito no database `visaopost` → Query Tool
4. Abre arquivo `backend/app/db/migrations/0001_initial.sql` → executa (botão F5)
5. Repete pra 0002 e 0003
6. Continua a partir do passo 4 acima (venv + uvicorn)

**Sinal de pronto Fase 2:** `/health/db` retorna `holidays_count >= 37` e `tenants_count >= 1`.

### Fase 3 — Render de imagem por IA (2-3 dias)
- [ ] `services/template_generator.py` — Gemini gera HTML completo do post
  - Input: brand kit, tema do dia, foto do produto, paleta
  - Output: HTML + CSS pronto para Playwright
- [ ] `services/renderer.py` — Playwright headless: HTML string → JPEG 1080x1080 q90
- [ ] `services/nano_banana.py` — edita foto produto com Gemini 2.5 Flash Image
- [ ] Endpoint dev `GET /dev/preview/{theme}` retorna JPEG renderizado
- [ ] Brand kit Di Lorenzo hardcoded em `seed_tenant_dilorenzo.sql` (cores, logo já em `docs/`)
- [ ] Teste: gerar 5 posts diferentes (Dia da Visão, Black Friday, Dia das Mães, etc.)

### Fase 4 — Geração de conteúdo (1 dia)
- [ ] `services/calendar.py` — dado uma data, retorna tema/feriado/mood
- [ ] `services/caption.py` — Gemini gera legenda + hashtags + CTA, tom da marca
- [ ] `services/post_generator.py` — orquestra: calendar → caption → template_generator → renderer → grava em `posts`
- [ ] Endpoint dev `POST /dev/generate-post` força geração para tenant
- [ ] Teste: rodar pra Di Lorenzo 30 dias seguidos sem repetir tema

### Fase 5 — Fila e agendamento (1 dia, dois modos)

**Modo dev local:**
- [ ] Worker RQ no Docker Compose
- [ ] Job `generate_daily_post(tenant_id, date)`
- [ ] Job `publish_to_instagram(post_id)` (esqueleto, espera token cliente)
- [ ] Scheduler RQ-scheduler: cron 06h gera, cron 12h publica
- [ ] Retry policy + dead-letter queue
- [ ] Endpoint dev `GET /dev/queue/status`

**Modo demo público (GitHub Actions cron, substitui RQ enquanto não tem VPS):**
- [ ] Workflow `.github/workflows/daily-post.yml` cron `0 9 * * *` (06h Brasília)
- [ ] Job sobe Postgres + Python, roda `python -m backend.scripts.generate_demo_post`
- [ ] Script gera JPEG + caption + metadata.json
- [ ] Commita em branch `previews/` ou pasta `previews/YYYY-MM-DD/`
- [ ] Push automático (token `GITHUB_TOKEN`)
- [ ] GitHub Pages serve `/previews/...` publicamente

### Fase 6 — Email aprovação + PWA (3 dias)
- [ ] `services/email.py` Resend API (free tier, sem cartão)
- [ ] `services/jwt.py` token magic link (expira 24h)
- [ ] Template email HTML responsivo (Jinja2)
- [ ] Endpoint `GET /api/posts/{token}` retorna dados do post pra PWA
- [ ] Endpoint `POST /api/posts/{token}/approve` e `/reject`
- [ ] PWA: rota `/aprovar/:token` em React + Bootstrap (imagem + caption + 2 botões)
- [ ] PWA: service worker + manifest (instalável no celular)
- [ ] Build PWA → `pwa/dist/` → **GitHub Pages serve em `/app`**
- [ ] Backend roda local → ngrok ou cloudflared tunnel para testes E2E sem VPS
- [ ] Teste manual ponta a ponta: tu mesmo recebe email mockup, aprova no celular

### Fase 7 — Landing pública (2 dias)
- [ ] Astro setup em `landing/`
- [ ] Template multi-tenant: hero, produtos, sobre, contato WhatsApp, mapa
- [ ] Dados via JSON commitado em `landing/data/dilorenzo.json` (sem Postgres em build estático)
- [ ] Componentes React interativos: form contato, galeria, botão WhatsApp flutuante
- [ ] SEO: meta tags, Schema.org JSON-LD (LocalBusiness + Optician), sitemap.xml
- [ ] Build → `landing/dist/` → **GitHub Pages**
- [ ] URL temporária: `maycon-mb.github.io/automacao_instagram/dilorenzo`
- [ ] Teste: carrega em <1s, Lighthouse 95+

### Fase 7b — Página de demo pro cliente (1 dia)
- [ ] Galeria pública dos posts gerados nos últimos 30 dias
- [ ] Cada post mostra: imagem 1080x1080, caption, hashtags, data, tema
- [ ] URL: `maycon-mb.github.io/automacao_instagram/preview`
- [ ] Serve de prova de valor antes do cliente liberar Instagram token
- [ ] Atualiza sozinho via GitHub Actions cron (Fase 5)

### Fase 8 — Deploy produção [VPS] (1 dia, após cliente confirmar)

#### 8.1 Provisionar VPS Hostinger
- [ ] Contratar VPS KVM 2+ na Hostinger (~R$30/mês). Ubuntu 24.04 LTS.
- [ ] SSH inicial: `ssh root@<ip>` (senha vem por email)
- [ ] Criar user não-root: `adduser deploy && usermod -aG sudo deploy`
- [ ] Adicionar chave SSH pública do Maycon em `/home/deploy/.ssh/authorized_keys`
- [ ] Desabilitar login root via senha (`/etc/ssh/sshd_config`: `PermitRootLogin no`, `PasswordAuthentication no`)
- [ ] Firewall: `ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable`
- [ ] Instalar Docker + Docker Compose: `curl -fsSL get.docker.com | sh && usermod -aG docker deploy`

#### 8.2 Setup arquivos produção
- [ ] Criar `docker-compose.prod.yml` (já tem `docker-compose.yml` dev como base):
  - Service `postgres`: imagem `postgres:17-alpine`, volume nomeado pra persistência, healthcheck
  - Service `redis`: imagem `redis:7-alpine`, volume nomeado, persistência AOF
  - Service `backend`: build `backend/Dockerfile`, depends_on postgres/redis (com healthcheck), restart unless-stopped
  - Service `worker`: mesmo Dockerfile, command `rq worker`, depends_on redis
  - Service `nginx`: imagem `nginx:alpine`, volumes: configs + certs Let's Encrypt + builds estáticos PWA/landing
- [ ] `nginx/prod.conf`: proxy `/api` → backend:8000, serve `/app/*` (PWA build), serve `/{slug}/*` (landing build), SSL via Let's Encrypt
- [ ] Migração Postgres dev→prod: `pg_dump` do Postgres 16 nativo Win + `pg_restore` no container Postgres 17. Schema é compatível up. Seeds são reaplicáveis (idempotência via `ON CONFLICT DO NOTHING` em seed scripts — adicionar se não tem)
- [ ] Certbot Let's Encrypt via container `certbot/certbot`, renovação cron

#### 8.3 Deploy automático via GitHub Actions
- [ ] Secret `SSH_PRIVATE_KEY` no GitHub repo settings
- [ ] Secret `VPS_HOST`, `VPS_USER` (deploy)
- [ ] Secret `.env` produção (cria via GitHub Secrets como GEMINI_API_KEY etc.)
- [ ] Workflow `.github/workflows/deploy.yml`:
  ```yaml
  on: push (branch main)
  steps:
    - checkout
    - ssh deploy@vps: git pull && docker compose -f docker-compose.prod.yml up -d --build
  ```
- [ ] Healthcheck pós-deploy: curl `https://api.visaopost.com.br/health` retorna 200

#### 8.4 Backup + monitoramento
- [ ] Conta Backblaze B2 (free 10GB)
- [ ] `rclone` configurado no VPS apontando bucket B2
- [ ] Cron VPS: `0 3 * * * pg_dump | gzip | rclone rcat b2:visaopost-backups/$(date +\%F).sql.gz`
- [ ] Cron retenção: deletar backups >30 dias
- [ ] Cron healthcheck: a cada 5min, curl `/health`. Se falha 3x consecutivas → dispara webhook WhatsApp Cloud API pro Maycon

#### 8.5 Migração GitHub Pages → VPS
- [ ] Comprar domínio `visaopost.com.br` no Registro.br
- [ ] Cloudflare: adicionar zona, mover nameservers
- [ ] DNS Cloudflare: A `@` → IP VPS, A `dilorenzo` → IP VPS, A `api` → IP VPS
- [ ] Cloudflare proxy ON (laranja)
- [ ] Build landing/PWA → copia pro VPS via deploy workflow
- [ ] Desativa GitHub Actions cron `daily-post.yml` (RQ no VPS assume)
- [ ] Atualiza `pwa/.env.production` apontando `VITE_API_URL=https://api.visaopost.com.br`

#### 8.6 Teste DR (disaster recovery)
- [ ] Derruba container Postgres no VPS
- [ ] Sobe novo Postgres do zero
- [ ] `rclone copy` último backup B2 → restore via `pg_restore`
- [ ] Verifica `/health/db` volta a contar tenants/holidays
- [ ] Documenta tempo total (RTO target: <30min)

**Sinal de pronto Fase 8:** push em main → 5min depois deploy ativo + healthcheck verde + backup do dia no B2.

### Fase 9 — BLOQUEADO PELO CLIENTE
Precisa o cliente entregar:
- [ ] Token Instagram Graph API (conta Business da Di Lorenzo + Facebook Page vinculada)
- [ ] Logo PNG fundo transparente + paleta + fontes + tom de voz (brand kit)
- [ ] 10-20 fotos de óculos da loja em alta qualidade (input pro Nano Banana)
- [ ] Decisão WhatsApp: Cloud API Meta (preferido) ou Twilio
- [ ] Se Cloud API: Meta Business Manager verificado + número dedicado + display name approval
- [ ] CSV ou planilha com base de clientes pro recall (nome, telefone, data último exame)
- [ ] Email do dono pra receber notificações
- [ ] Decisão de domínio: usar subdomínio `dilorenzo.visaopost.com.br` ou domínio próprio
- [ ] Aprovar tom de voz: testar 5 posts gerados pelo sistema antes de virar produção
- [ ] Termo de uso de imagem dos produtos (LGPD)

### Fase 10 — Integração final (depende Fase 9)
- [ ] Endpoint `services/instagram.py` publicar via Graph API
- [ ] Webhook receber métricas pós-publicação
- [ ] Onboarding completo no PWA (upload logo, fotos, conexão Instagram via OAuth)
- [ ] Bot WhatsApp Cloud API: webhook + parser de intenção (Gemini) + respostas
- [ ] Recall WhatsApp: job semanal varre `clients`, dispara mensagem template
- [ ] Dashboard métricas (Recharts ou ECharts no React)

---

## 9. Decisões Importantes Já Tomadas

| Decisão | O que foi escolhido | Por quê |
|---|---|---|
| Banco | Postgres 17 no VPS, sem Supabase | Consolidação, free tier instável, dev tem expertise |
| Hospedagem | Tudo num VPS Hostinger | 1 painel, 1 backup, escala melhor |
| Render imagem | Playwright + HTML/CSS gerado por IA | Substituiu Pillow puro. Layout único por post, brand respeitado, dev tem Playwright no CV |
| WhatsApp | Cloud API Meta (Twilio fallback) | 1000 conversas/mês grátis, oficial, não bane |
| Frontend cliente | React + Vite + Bootstrap 5 | Componentes prontos, MVP rápido |
| Landing | Astro + React + Tailwind | SSG, SEO local, visual premium |
| Fila | RQ + Redis | APScheduler perde job em restart |
| Auth | JWT magic link email | Sem senha, sem atrito |
| ORM | Não usar — SQL puro | Performance, controle multi-tenant |
| Painel admin | Não criar na Fase 1 | Acessar Postgres direto via psql/DBeaver |

---

## 10. Próximos Passos Imediatos

**Status atual: MODO FREE TIER.** Cliente Di Lorenzo pagou Premium, mas ainda não confirmou início. Não gastar nada com VPS/domínio até confirmação. Avançar tudo o que dá pra fazer 100% local + GitHub.

Comando para iniciar próxima sessão:
> "Lê `CLAUDE.md` e `PLANO.md`. Estamos em modo free tier. Começa pela Fase 0a (criar contas grátis Gemini + Resend, sem assinar nada pago) e depois Fase 1 (reorganizar o repo, criar `backend/` com FastAPI + Pydantic, `requirements.txt`, `Dockerfile`, `docker-compose.yml` dev com Postgres + Redis). Move o `src/` atual pra `pwa/`. Configura pre-commit + GitHub Actions CI. Depois espera meu OK pra Fase 2 (schema SQL)."

### Caminho até cliente liberar tokens (zero custo)

Fase 0a → 1 → 2 → 3 → 4 → 5 (modo demo público GitHub Actions) → 6 (Resend) → 7 + 7b (GitHub Pages).

Final desse caminho:
- Landing Di Lorenzo no ar em `maycon-mb.github.io/automacao_instagram/dilorenzo`
- Galeria de 30 posts gerados por IA em `/preview`
- Geração diária automática via GitHub Actions cron
- Email aprovação funciona (tu mesmo recebe pra testar)
- **Demo serve de gatilho pra cliente liberar Instagram token + WhatsApp**

### Caminho após cliente confirmar

Fase 0b (assinar VPS + domínio) → 8 (deploy produção) → 9 (cliente entrega tokens) → 10 (integração final).

---

## 11. Riscos Conhecidos

- **Aprovação Meta Business Manager**: pode travar 24-72h. Plano B = Twilio.
- **Limite Gemini free**: 15 req/min, 1500/dia. Suficiente para 1 cliente, monitorar quando bater 5+.
- **Instagram Graph API muda regras**: Meta deprecia endpoints sem aviso longo. Subscrever changelog.
- **VPS Hostinger uptime**: SLA ~99.5%. Para uptime maior, precisa multi-região (deixar pra escala).
- **Foto óculos baixa qualidade**: Nano Banana não salva imagem ruim. Validar com cliente antes.

---

## 12. Quando Pronto para Cliente

Sinal de pronto da Fase 8: passar 7 dias seguidos gerando + aprovando posts da Di Lorenzo em ambiente staging sem intervenção manual. Não publica no Instagram real ainda.

Depois disso, agendar reunião com cliente para:
1. Coletar tudo da Fase 9
2. Configurar tenant real
3. Rodar 7 dias em produção paralela (gera mas não publica) para validação
4. Liberar publicação automática
