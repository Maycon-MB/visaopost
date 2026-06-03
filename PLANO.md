# PLANO

Roadmap de execução. Mandatos técnicos em [`CLAUDE.md`](CLAUDE.md). Visão geral em [`README.md`](README.md). **Fonte da verdade do escopo prometido = [`pitch/`](pitch/src/data/content.js) + [`ValueDetailModal`](pitch/src/components/ValueDetailModal.jsx).** Tudo lá foi vendido pro cliente Di Lorenzo no plano **Piloto Automático (Premium)** = R$297/mês + R$1.500 setup.

---

## Status (2026-06-03)

**Modo:** FREE TIER. **Cliente Di Lorenzo fechou** (informal via WhatsApp 2026-05-28, contrato + LGPD a formalizar). Zero gasto com VPS/domínio até estar tudo pronto local + ele entregar tokens (Fase 9).

| Fase | Escopo | Status |
|---|---|---|
| 0a | Contas grátis Gemini + Resend | ✅ chaves em `backend/.env` + backup Bitwarden |
| 1 | Foundation (FastAPI, Docker, CI, structlog, /health) | ✅ |
| 2 | Schema SQL + seed calendário BR + tenant Di Lorenzo | ✅ validado em Postgres 16 nativo Win |
| 3 | Pipeline render IA→JPEG (Gemini + Playwright) | ✅ 5/5 temas, 24 testes, hardening (Pydantic models + repos + Protocol DI) |
| 4 | `calendar.py` + `caption.py` + `post_generator.py` | ✅ done* (gate 30d migrado pra Fase 5) |
| 5 | Retry 429 Gemini + GH Actions cron demo + RQ infra + queue endpoints + stock photos | ✅ |
| 6a | Backend PWA do dono (email + JWT + 14 endpoints + 28 tests) | ✅ |
| 6b | PWA `/aprovar/:token` (tela do email, touch 56px, SW offline) | ✅ |
| 6c | PWA `/clientes` CRUD + CSV + filtros + migration 0006 | ✅ |
| 6d | PWA `/settings` (horário, dias, regras IA, FAQ bot) wired ao backend | ✅ |
| 6e | PWA `/dashboard` (ECharts, bento, tema claro/escuro) | ✅ |
| 6f | PWA `/produtos` CRUD + upload foto + backend `/api/products` + migration 0009 | ✅ |
| 6g | Auth login/senha + JWT sessão + guard assinatura + migrations 0005+0007+0008 | ✅ |
| **7a** | **Landing Astro pública Di Lorenzo** (design pitch, React, Playfair+Montserrat, hero+catálogo+agendamento+depoimentos+unidade) | **✅ 2026-06-03** |
| 7b | Galeria pública dos posts aprovados | pendente |
| 7c | QR Code de balcão + form opt-in recall | pendente |
| pré-0b | Contrato + LGPD formal (cliente já topou informal) | **em curso humano** |
| 0b | Hostinger + domínio + Cloudflare + Backblaze B2 | aguarda 7b/7c done |
| 8 | Deploy VPS produção | depende 0b |
| 9 | Cliente entrega tokens + brand + FAQ + fotos + decisões | **gate cliente** |
| 10a-j | Integração ondas (IG + bot WA + recall + scripts reels + GMB sync + relatório + personagem + reviews→posts + posts contextuais) | depende 9 |
| 11 | Operacional contínuo (atualização + manutenção bot + consultoria ROI) | recorrente pós-handoff |
| 6 | PWA do dono: aprovação + `/clientes` CRUD + `/settings` (horário, dias, instruções) | pendente |
| 7 | Landing Astro multi-tenant + galeria preview dos posts | pendente |
| pré-0b | Kickoff comercial: Onboarding Pack PDF + contrato + LGPD + reunião + assinatura | pendente |
| 0b | [VPS] assinar Hostinger + domínio + Cloudflare + Backblaze B2 | depende kickoff |
| 8 | [VPS] Deploy produção (Docker, Nginx, Let's Encrypt, GH Actions SSH) | depende 0b |
| 9 | Cliente entrega tokens (Instagram, brand kit, fotos, WhatsApp) | bloqueado |
| 10 | Integração final + handoff (Instagram Graph, bot WhatsApp, brand/assets/regras, treino, suporte, status) | depende 9 |

Schema SQL real: `backend/app/db/migrations/0001_initial.sql`. Estrutura do repo: `CLAUDE.md`. Aprendizados Fase 3: commit `83ccab5`.

---

## Fase 4 — Geração de conteúdo (DONE *)

Objetivo: pipeline diária que pega data → tema → caption + HTML → JPEG → grava em `posts`.

- [x] `services/calendar.py` — `resolve_theme(date) -> ThemeContext`. Holiday lookup + pool orgânico **30 temas** (não 15: pool 15 não cobria 30 dias sem repetir). Rotação determinística por `date.toordinal() % 30`. Moods independentes (4 itens).
- [x] `services/caption.py` — Gemini JSON mode → `PostCopy(caption, hashtags, cta)` + Pydantic validate. `ModelClient` Protocol pra DI. Retry max 2. `max_output_tokens=4096` (2048 batia `MAX_TOKENS` em ~10% caption longa).
- [x] `db/repositories/posts.py` — `create_post(...)` tipado. `get_tenant_id_by_slug` em `tenants.py`. CTA + holiday_name persistem em `metadata` jsonb (sem coluna dedicada).
- [x] `services/post_generator.py` — orquestra brand → tema → copy → html → jpeg → DB. `TenantNotFound` exception. JPEG em `backend/tmp/posts/{post_id}.jpg`. `DEFAULT_TZ` = `timezone(timedelta(hours=-3))` (Brasil sem DST desde 2019, evita dep `tzdata` no Windows).
- [x] Endpoint dev `POST /dev/generate-post` body `{tenant, date}` + `GET /dev/posts/{post_id}.jpg` (serve JPEG local).
- [x] Tests fast: `test_calendar` (7), `test_caption` (12), `test_post_generator` (5 com fakes), `test_posts_repo` (4 marker `db`). **20+ testes verde.**
- [x] Smoke `scripts/smoke_fase4_quick.py` (5 dias) — 5/5 ok com captions, hashtags, CTAs e JPEGs salvos. Pipeline 100% funcional.
- [x] Patch prompt anti-invenção (template_generator + caption): proíbe nomes/depoimentos fictícios, métricas inventadas, preços. Glossário ortográfico pt-BR (performance, excelência, sofisticação, requinte).
- [x] Patch `os.chdir(ROOT)` em smokes — Pydantic Settings resolve `.env` pelo CWD.

**Sinal de pronto (revisado):** Pipeline E2E validado em 9 posts reais (5 quick + 4 do smoke 30d). Tests passam. Bugs encontrados (typo "perfomance", nome inventado "Mariana S.") viraram patches de prompt.

**Asterisco:** Smoke 30d completo bloqueado por **quota Gemini free tier (20 req/dia)**. Smoke gasta 2/dia × 30 = 60 calls. Validação 30d migrada pra **Fase 5** — RQ worker já tem retry+backoff nativo + rate-limit handling, vai validar como side-effect.

**Aprendizados:**
- Pool 15 não cobre 30 dias sem repetir — subir pra 30 (ou pool 15 × 3 moods = 45 combos).
- Free tier Gemini = 20 req/dia. Pra smoke 30d cliente paga ~$0.50 OU espera reset.
- Gemini Flash erra ortografia esporádico (perfomance) e inventa nomes em tema "depoimento_cliente" → prompt explícito anti-invenção + glossário corrige.
- Brand colors: Gemini variou fundo (1 de 5 saiu bege em vez de verde). Reforço "fundo SEMPRE primary" no prompt.

---

## Fase 5 — Fila e agendamento (em curso)

Dois modos:

**Dev/demo (GitHub Actions cron, sem VPS):**
- [x] Workflow `.github/workflows/daily-post.yml` cron `0 9 * * *` (06h Brasília) + `workflow_dispatch` manual.
- [x] Job sobe Postgres 17 service, aplica migrations 0001-0003, instala Chromium Playwright, roda `python -m scripts.generate_demo_post`.
- [x] Commita JPEG + metadata.json em `previews/YYYY-MM-DD/` (bot github-actions). `[skip ci]` no commit pra não retrigger.
- [x] `scripts/build_previews_index.py` regenera `previews/index.html` (galeria estática, dark, cards 1:1, mobile-first). GitHub Pages serve `/previews/index.html`.
- [ ] Secret `GEMINI_API_KEY` precisa estar em Settings → Secrets → Actions.

**Produção (RQ + Redis no VPS, Fase 8):**
- [x] `app/workers/tasks.py` — job síncrono `generate_daily_post(tenant_slug, target_date_iso)` que faz `asyncio.run(generate_post(...))` e retorna dict serializável.
- [x] `app/workers/worker.py` — entrypoint `python -m app.workers.worker` rodando `Worker(...).work(with_scheduler=True)`.
- [x] `app/services/queue.py` — `get_queue`, `enqueue_daily_post` (job_id determinístico `daily-{tenant}-{date}`), `queue_status` snapshot por fila. Retry RQ nativo 3× com 60s + `JOB_TIMEOUT=300s` + `RESULT_TTL=7d`.
- [x] Endpoints dev `POST /dev/queue/enqueue-daily` + `GET /dev/queue/status` (503 quando Redis down).
- [x] **Backoff Gemini in-process:** `app/services/_gemini_retry.py` — `ResourceExhausted` (429), `ServiceUnavailable` (503), `DeadlineExceeded` (504), `InternalServerError` (500). Backoff exponencial `1→2→4→8→16s` + jitter 50%, max 5 tentativas. `call_with_backoff(fn, sleep=..., rng=...)` injetável pra teste determinístico. Wired em `caption.py` + `template_generator.py`.
- [x] Tests fast: `test_gemini_retry` (7), `test_queue` (6 com fakeredis). **62 testes verde** (era 49 antes da Fase 5).
- [x] Lint/format/typecheck: ruff + ruff format + mypy strict = 0 erro. Limpou 9 falhas legadas (UP017, UP035, F401, RUF002, no-any-return em `logging.py` + `main.py`).
- [ ] Booting real do worker + dead-letter queue → Fase 8 quando VPS subir Redis.

**Gate herdado da Fase 4:** Smoke 30d sem repetir tema com retry funcional. **Pendente** — rodar manualmente com `backend/scripts/smoke_fase4.py` agora que `call_with_backoff` está plugado. Free tier 20/dia exige 3 dias OU paid 1-shot.

**Aprendizados:**
- IDE Pyright apontava todo `requirements.txt` como "not installed" — interpretador errado, ignorado. Pre-existing.
- RQ 1.16.2 emite `DeprecationWarning` em `datetime.utcnow()` — espalha 42 warnings no pytest. Suprimir só quando migrar pra RQ 2.x (timezone-aware).
- `redis.from_url` não tem stubs tipados → `cast(redis.Redis, ...)` + `# type: ignore[no-untyped-call]` é o caminho que sobra com `mypy --strict`.
- Workflow cron commit precisa `permissions: contents: write` + bot identity pra `git push` não 403.
- Job_id determinístico `daily-{tenant}-{date}` é o único guard contra duplicata: RQ não tem unique constraint nativa.

---

## Inventário do que foi prometido no pitch (Piloto Automático)

Lista canônica. Toda fase abaixo entrega um pedaço disto. Nada do pitch pode ficar de fora.

| # | Promessa | Fase responsável |
|---|---|---|
| 1 | 30 posts/mês Instagram (gerados + aprovados + publicados automaticamente) | 3 ✅ + 5 ✅ + 10a |
| 2 | Identidade visual exclusiva (logo, paleta, fontes, tom) | 9 (cliente entrega) + 10c (tela `/brand`) |
| 3 | Estratégia de conteúdo + calendário datas comemorativas BR | 2 ✅ + 4 ✅ |
| 4 | Aprovação via celular (email + PWA) | 6 ✅ backend / 6b PWA |
| 5 | Postagem automática horários ótimos | 5 ✅ + 10a |
| 6 | Sua Vitrine Blindada (monitoring 24h conexão) | 10g status page + healthchecks |
| 7 | Atualização constante (acompanhar mudanças algoritmo IG) | operacional (Fase 11) |
| 8 | Landing Page Premium (site público da ótica) | 7 |
| 9 | Lembrete de Retorno via WhatsApp (Recall 1+ ano) | 10b |
| 10 | Google Meu Negócio (SEO + posts → GMB) | 7 (SEO) + 10d (sync GMB) |
| 11 | Scripts pra Reels de Autoridade (gerador de roteiros) | 10e |
| 12 | Bot WhatsApp de Agendamento (FAQ + agenda exame) | 10a |
| 13 | Catálogo Digital — dono sobe fotos pelo admin, aparece no site público pros clientes finais | 6f admin upload + 7a landing exibe |
| 14 | QR Code de Balcão Integrado (adesivo → opt-in recall) | 7b (rota pública `/recall/qr/{tenant}`) |
| 15 | Relatório de Vendas Mensal PDF | 10f |
| 16 | Atendente Virtual 24h (manutenção bot WA) | operacional (Fase 11) |
| 17 | Recuperação de Clientes 1+ ano | 10b (mesmo que recall) |
| 18 | Consultoria de ROI mensal | operacional (Fase 11) |
| 19 | Posts com personagem da marca recorrente (claim "3x alcance") | **OPCIONAL** — Fase 10h (sugestão, cliente decide) |
| 20 | Avaliações Google 5★ viram posts | 10i |
| 21 | Posts contextuais (tendências mercado óptico) | 10j (scraper + Gemini) |
| 22 | FAQ completo configurado no setup inicial (bot WA) | 9 + 10a |
| 23 | Visita Domiciliar agendamento (via bot ou tela) | 10a (bot encaminha) |
| 24 | Dashboard métricas (alcance, likes, salvos, recalls, visitas site) | 6d skeleton + 10f real |

---

## Fase 6 — PWA do dono (admin completo)

PWA mobile/tablet first em `pwa/` (React 18 + Vite + Bootstrap 5). Service worker + manifest (instalável). Build → `pwa/dist/` → GitHub Pages em `/app` (Fase 8 migra pra VPS). Auth via JWT magic link (sem senha).

**Critérios mobile/tablet first (não negociáveis):**
- Touch targets ≥ 44×44px (Apple) / 48dp (Google). Botão "aprovar" tem que ser impossível de errar com dedo.
- Breakpoints Bootstrap: celular (<576px) mostra essencial; tablet (≥768px) adiciona colunas/seções; desktop é bônus.
- Lighthouse mobile ≥ 95 (Performance + Accessibility + Best Practices).
- Bundle JS+CSS gzipped < 200KB. Imagens com `loading="lazy"`.
- Offline-first: service worker cacheia post pendente + tela aprovação. Sem net → consegue aprovar; sync depois.
- Email Resend renderiza bem em Gmail mobile + iOS Mail (tabela aninhada, max-width 600px, fontes ≥ 14px).
- Sem hover-only, sem fixed positioning agressivo (URL bar Safari iOS quebra).

### Fase 6a — Backend pronto ✅
- [x] `services/email.py` (Resend), `services/jwt.py` (magic link 24h).
- [x] Template email HTML responsivo (Jinja2) Gmail+iOS Mail compatible.
- [x] Endpoints `GET/POST /api/posts/{token}` (approve / reject / regenerar).
- [x] Endpoints REST `/api/clients` GET/POST/PATCH/DELETE + `/import` (CSV) + `/export.csv`.
- [x] Endpoints `/api/settings` GET/PATCH.
- [x] Migration 0004: `send_hour`, `publish_hour`, `active_weekdays jsonb`, `extra_instructions text`, `posts.approval_feedback`, `posts.regenerate_count`.
- [x] 28 testes novos (jwt + models + email render).

### Fase 6b — PWA `/aprovar/:token` (tela do email) ✅
- [x] React 18 + Vite 5 + Bootstrap 5 (CSS only) + react-router-dom 6 boot. Manifest + service worker via `vite-plugin-pwa` (autoUpdate, NetworkFirst em `/api/posts/`, CacheFirst em imagens).
- [x] Rota `/aprovar/:token`. Mostra imagem 1:1, caption, hashtags, CTA, status pill, tema/feriado/contador regenerações.
- [x] 3 botões touch ≥ 56px: ✅ aprovar, 🔁 gerar outro (feedback obrigatório), ❌ rejeitar (motivo opcional). Estados loading/error/done isolados.
- [x] Backend `CORSMiddleware` + settings `frontend_url`/`cors_origins`. Build prod 87KB gzipped (JS 55.8KB + CSS 31.6KB), Lighthouse-friendly.
- [ ] E2E via ngrok + Resend real — fazer depois com email do dono Di Lorenzo.

### Fase 6c — Tela `/clientes` ✅ (independe Instagram token, cliente usa dia 1)
- [x] Tabela com search + filtros (todos, ativos, exame +12m, novos da semana, opt-out). Wired ao backend real.
- [x] Formulário cadastro: essenciais (nome, WhatsApp, nascimento, **consentimento WhatsApp/LGPD**) + acordeão "mais detalhes" (email, bairro, último exame, próximo retorno, convênio, tipo lente, última compra + valor, armação, origem, observações).
- [x] Import CSV + Export CSV (via blob com token).
- [x] Botões linha: editar / marcar contatado / exame feito / opt-out / reativar.
- [x] Migration 0006 expandiu `clients` (consent_whatsapp, consent_at, birth_date, source, health_plan, lens_type, frame_brand, last_purchase_date, last_purchase_value_brl, next_return_date, neighborhood). Repo + models atualizados.
- [x] Tenant vem do **token de sessão** (não mais `?tenant=`).

### Fase 6g — Login do painel + controle de assinatura ✅ (NOVO, não estava no plano original)
- [x] Migration 0005 `admin_users` (owner/staff, multi-usuário por tenant) + `password_resets` + `subscription_status` no `tenants` (active/past_due/suspended/canceled). Migration 0007 add `username`.
- [x] Auth: login por **usuário OU email** + senha (bcrypt), JWT de sessão, esqueci-senha + redefinir (token hash, email Resend), `current_principal`/`current_tenant_id` deps.
- [x] **Guard de inadimplência/cancelamento:** login bloqueia se assinatura suspensa/cancelada (dados preservados).
- [x] Frontend: `AuthContext`, rotas `/login` `/esqueci-senha` `/redefinir-senha`, route guard, AppShell com usuário real + logout.
- [x] Seed dev: `scripts/create_admin.py` (admin/admin). Runner `scripts/apply_migrations.py`.
- [x] **Modo demo** (`VITE_DEMO`): build estático em `docs/app` pro GitHub Pages — abre direto no painel, dados de exemplo, sem login. Pendente: **owner/staff CRUD** (convidar equipe) — endpoints/models prontos, falta tela.

### Fase 6d — Tela `/settings` (configs do dono)
- [ ] Horário envio email (default 06h), horário publicação (default 12h).
- [ ] Dias ativos (default seg-sáb).
- [ ] **Regras IA pra posts** (campo livre — "evita vermelho", "menciona promoção do mês").
- [ ] **Regras IA pro bot WhatsApp** (FAQ texto livre — horário, preços, política, quando transferir pra humano). Conecta com Fase 10a.

### Fase 6e — Tela `/dashboard` (skeleton agora, dados reais na Fase 10f)
- [ ] Cards: posts publicados/mês, alcance IG, clientes cadastrados, recalls enviados/respondidos, visitas no site.
- [ ] Gráfico linha Recharts: posts × engajamento últimos 30 dias.
- [ ] Gráfico barra: melhores posts (likes/salvos).
- [ ] Atividade recente: "post de hoje aguarda aprovação", "3 recalls responderam".
- [ ] Estado vazio elegante enquanto tokens IG/WA não chegaram (Fase 9). Mostra contagem só do que dá pra ler do DB (clientes, posts gerados, recalls disparados).

### Fase 6f — Admin `/produtos` (upload de fotos do catálogo — item 13 pitch)
Dono sobe fotos dos produtos pelo painel admin. Aparecem no site público (Fase 7a) pros clientes finais verem.

- [ ] Tela `/produtos` no PWA: grid com fotos atuais + botão "+ Adicionar produto".
- [ ] Form upload: foto (drag-drop ou seletor), nome, categoria (Solar/Grau/Premium/Lentes), descrição curta, preço opcional, tags.
- [ ] Edit inline: clica produto → modal com mesmos campos pra editar.
- [ ] Delete com confirmação.
- [ ] Reordenar via drag (define ordem que aparece no site público).
- [ ] Backend: endpoints `GET/POST/PATCH/DELETE /api/products` + upload via UploadFile.
- [ ] Storage: dev local em `backend/tmp/products/{tenant_id}/`. Fase 8 migra pra Backblaze B2.
- [ ] Migration 0005: tabela `products (id, tenant_id, name, category, description, price_brl, image_url, tags, position, is_active, created_at)`.

**Sinal de pronto Fase 6:** Maycon recebe email mockup, aprova no celular. Cliente fictício cadastrado via tela + CSV. Settings persiste. Dashboard mostra contagens reais (não-IG ainda). Catálogo navega + exporta PDF.

---

## Fase 7 — Landing pública + galeria + QR Code de Balcão

### Fase 7a — Landing Astro multi-tenant (itens 8 + 13 pitch)
- [ ] Astro em `landing/`. Template multi-tenant (hero, sobre, **catálogo de produtos** alimentado por Fase 6f, WhatsApp, mapa). Dados em `landing/data/<slug>.json` + fetch da API `/api/products?tenant=X`.
- [ ] Seção catálogo: grid de produtos com foto + nome + categoria + preço (se houver). Filtros por categoria. Click no produto → modal com descrição + botão "Quero esse, falar WhatsApp" (mensagem pré-preenchida).
- [ ] **SEO completo:** meta tags + Schema.org JSON-LD (`LocalBusiness` + `Optician` + `Service`) + sitemap.xml + robots.txt.
- [ ] **Google Meu Negócio (GMB):** integração inicial = JSON-LD compatível + structured data Reviews. Sync ativo de posts → GMB fica pra Fase 10d.
- [ ] Build → GitHub Pages `/dilorenzo`. Fase 8 migra pra VPS `dilorenzo.visaopost.com.br`.
- [ ] Lighthouse mobile ≥ 95.

### Fase 7b — Galeria pública dos posts
- [ ] Rota `/preview` ou `/galeria` na landing. Mostra últimos 30 posts aprovados.
- [ ] Pull de `previews/YYYY-MM-DD/*.jpg` que o cron alimenta (Fase 5). Pós-VPS: pull do DB direto.
- [ ] Click no post abre lightbox + legenda + hashtags + data.

### Fase 7c — QR Code de Balcão (item 14 pitch)
- [ ] Rota pública `/recall/qr/{tenant_slug}` no backend. Recebe scan, mostra form opt-in: nome + telefone WhatsApp.
- [ ] Cria row em `clients` com `metadata.source = "qr_balcao"` + envia template WA confirmação.
- [ ] Endpoint `/api/qr/print?tenant=X` gera QR PNG + PDF A6 elegante pro dono imprimir e colar no balcão.
- [ ] Estrutura JSON-LD: aparece como ação no Google Maps "Cadastrar no recall".

**Sinal de pronto Fase 7:** Landing Di Lorenzo no GH Pages, Lighthouse 95+, galeria pública dos posts gerados, QR code imprimível funcional + form opt-in cadastra cliente real.

---

## Fase pré-0b — Kickoff comercial (após Fase 7 done, antes de gastar 1 real)

Reunião profissional com cliente. Marca o "vai" formal.

- [ ] **Onboarding Pack PDF** (Canva ou Astro→PDF): o que é o serviço, cronograma de 30 dias, checklist do que o cliente entrega, contatos de suporte. Pode ter print do PWA + galeria preview.
- [ ] **Contrato de prestação** (escopo Premium R$1.500 setup + R$297/mês, SLA de geração diária 99% dias úteis, prazo 30 dias setup, cancelamento com 30 dias aviso, propriedade do conteúdo gerado).
- [ ] **Termo LGPD** (uso de imagem dos produtos + base de clientes pra recall, opt-out, retenção, controlador/operador).
- [ ] Reunião presencial ou call: apresenta demo GH Pages + galeria preview + assina contrato + entrega checklist Fase 9.
- [ ] Cliente confirma → libera Fase 0b. Pagamento setup R$1.500 entra antes da Fase 8 começar.

**Sinal de pronto:** contrato assinado + checklist Fase 9 nas mãos do cliente + setup pago.

---

## Fase 0b — Setup pago [VPS] (após Fase pré-0b)

- [ ] Hostinger KVM 2+ (~R$30/mês), Ubuntu 24.04.
- [ ] Domínio Registro.br (`visaopost.com.br`).
- [ ] Cloudflare (DNS + proxy laranja).
- [ ] Backblaze B2 (free 10GB backup).

---

## Fase 8 — Deploy produção [VPS]

Outline. Detalhar passo-a-passo quando começar.

1. Provisionar VPS: user `deploy`, SSH key, ufw, Docker + Compose. Desabilitar root SSH.
2. `docker-compose.prod.yml`: postgres17, redis7, backend, worker, nginx (todos com healthcheck + restart unless-stopped + volumes nomeados).
3. Nginx + Certbot Let's Encrypt. Routes: `/api` → backend, `/app` → PWA build, `/{slug}` → landing build.
4. Migração Postgres dev→prod: `pg_dump` → `pg_restore`. Idempotência via `ON CONFLICT DO NOTHING` em seeds.
5. GitHub Actions `deploy.yml`: SSH push → `docker compose pull && up -d`. Secrets: `SSH_PRIVATE_KEY`, `VPS_HOST`, env produção.
6. Backup: cron diário `pg_dump | rclone rcat b2:...`. Retenção 30d. Healthcheck cron 5min, alerta WhatsApp se falhar 3x.
7. Migrar GitHub Pages → VPS: DNS Cloudflare aponta pra VPS. Desativa cron `daily-post.yml`. PWA aponta `VITE_API_URL=https://api.visaopost.com.br`.
8. Teste DR: derruba Postgres → restore do B2 → `/health/db` verde. RTO target <30min.

**Sinal de pronto:** push em main → deploy ativo em 5min + healthcheck verde + backup do dia no B2.

---

## Fase 9 — BLOQUEADO PELO CLIENTE (entrega de tokens + brand + decisões)

Cliente Di Lorenzo precisa entregar:

### Tokens e credenciais
- **Token Instagram Graph API** (conta Business + Facebook Page vinculada).
- **Token WhatsApp Cloud API Meta** (Business Manager verificado + número dedicado + display name aprovado). Twilio é fallback se aprovação Meta travar.
- **Email do dono** pra notificações.
- **Telefone WhatsApp pessoal do dono** pra avisos de sistema (opcional).

### Brand kit completo
- Logo PNG fundo transparente + variações (claro/escuro).
- Paleta cores (primary, secondary, accent, text, background) em HEX.
- Fontes preferidas (ou aceita system fonts).
- Tom de voz (1 parágrafo descrevendo, + 3 exemplos de frases que ele já usa).
- **Personagem da marca recorrente (OPCIONAL):** sugestão do pitch como diferencial. Cliente decide se quer ativar — se sim, define nome fictício + estilo + cenários + escolhe foto base.

### Assets visuais
- 10-20 fotos de óculos alta qualidade (input principal pro Nano Banana editar nos posts).
- Foto da fachada / vitrine pra landing.
- Foto do ambiente interno pra "Sobre Nós".
- Foto do dono / equipe (opcional).

### FAQ pro bot WhatsApp (item 22 pitch — "FAQ completo configurado no setup")
- Horário de funcionamento (seg-sex / sáb / dom).
- Preços (exame, ajuste, troca lente, conserto).
- Convênios aceitos.
- Política de garantia.
- Tempo médio de entrega de óculos.
- Quando transferir pra humano (perguntas de desconto fora do padrão, reclamação, etc.).

### Catálogo de produtos (Fase 6f preencher)
- Lista de coleções principais + 5-10 produtos destaque com foto + nome + preço opcional.

### Decisões
- Subdomínio grátis (`dilorenzo.visaopost.com.br`) vs domínio próprio (`oticadilorenzo.com.br`).
- CSV/planilha clientes pra recall (nome, telefone, último exame).
- Aprovação do tom de voz: testar 5 posts gerados, ele valida antes de virar produção.
- Termo de uso de imagem dos produtos (LGPD).
- Termo opt-in dos clientes pra recall WhatsApp (LGPD).

---

## Fase 10 — Integrações finais + features Premium (depende Fase 9)

Quebrada em sub-entregas porque cada uma é independente e pode subir em ondas pro cliente.

### Fase 10a — Instagram + Bot WhatsApp + Recall (núcleo Premium)
- [ ] `services/instagram.py`: publica via Graph API. Container endpoint + media publish + agendamento.
- [ ] Webhook IG: captura métricas (reach/impressions/likes/saves/comments/shares/profile_visits) pra `metrics_instagram`.
- [ ] `services/whatsapp.py`: webhook Cloud API + parser intenção via Gemini + resposta automatizada.
- [ ] Bot FAQ alimentado por `tenants.whatsapp_faq` (Fase 9 entrega).
- [ ] Bot escala: pergunta complexa → encaminha pro humano com contexto.
- [ ] **Bot agenda exame**: detecta intenção "quero agendar", coleta nome + telefone + dia preferido, cria evento + confirma.
- [ ] **Recall WhatsApp 1+ ano** (itens 9 + 17 pitch): job semanal segunda 10h varre `clients WHERE last_exam_date < now() - interval '12 months' AND status='active'`. Dispara template Meta aprovado. Atualiza `last_contacted_at`. Opt-out após 3 ignored.
- [ ] Onboarding completo no PWA (upload logo, fotos, OAuth Instagram, conexão WA).

### Fase 10b — Telas admin PWA pós-tokens
- [ ] `/brand` — editar paleta, voz, fontes, logo (schema já pronto Fase 2).
- [ ] `/assets` — galeria fotos óculos (CRUD + tags). Tabela `assets` já pronta.
- [ ] `/regras` — V2 com checkboxes (V1 já é texto livre na Fase 6d).
- [ ] `/faq-bot` — editor do FAQ do bot WA (item 22 pitch).

### Fase 10c — Status page (item 6 pitch "Vitrine Blindada")
- [ ] `/status` público no backend: últimas 24h health + posts publicados + recalls disparados + uptime % mês.
- [ ] Healthcheck cron 5min. 3 falhas seguidas → alerta WhatsApp pro Maycon.
- [ ] Endpoint `/health/db`, `/health/redis`, `/health/gemini` (quota check).

### Fase 10d — Google Meu Negócio sync (item 10 pitch — segunda parte)
- [ ] `services/google_business.py` autentica via OAuth Google Business Profile API.
- [ ] Após post aprovado e publicado no IG, faz cross-post pro GMB (texto + imagem).
- [ ] Sincroniza reviews 5★ do GMB pra `assets.metadata` (input pra Fase 10i).

### Fase 10e — Scripts pra Reels de Autoridade (item 11 pitch)
- [ ] `services/reels_scripts.py` gera 4 roteiros/mês via Gemini. Cada roteiro: hook (3s), corpo (15-30s), CTA (5s).
- [ ] Temas: "como escolher armação por formato de rosto", "diferença lente antirreflexo", "quando trocar de grau", etc.
- [ ] Job mensal dia 1 → email pro dono com 4 roteiros + dicas de gravação.
- [ ] Tela `/reels` no PWA pra ele ler/editar/arquivar.

### Fase 10f — Relatório mensal PDF + Dashboard real (itens 15 + 24 pitch)
- [ ] `services/monthly_report.py`: posts publicados, alcance total, top 3 posts, recalls disparados/respondidos, clientes novos, agendamentos via bot.
- [ ] Gera PDF via Playwright (HTML → PDF) com identidade visual da marca.
- [ ] Job cron dia 1 de cada mês → email pro dono com PDF anexo.
- [ ] **Dashboard real** (Fase 6e skeleton ganha dados): pluga métricas IG + WA + GMB + site (Cloudflare Analytics ou Plausible).

### Fase 10g — Monitoramento operacional (item 7 pitch)
- [ ] Subscribe Instagram Platform Changelog.
- [ ] Sentry ou similar pra erros backend.
- [ ] Alerta WhatsApp pro Maycon: quota Gemini quase no limite, IG token quase expirando, falha publicação 3x seguidas.

### Fase 10h — Personagem da marca recorrente (item 19 pitch — OPCIONAL, sugestão)
Não obrigatório. Pitch menciona como diferencial ("3x alcance vs foto genérica"). Cliente decide se quer ativar.

- [ ] Conversa com cliente: ele topa criar personagem ou prefere só fotos reais dos produtos.
- [ ] Se SIM: definir personagem (nome fictício, idade, estilo), selecionar foto base, pipeline edita via Nano Banana em cenários.
- [ ] Se NÃO: skip — fotos reais do catálogo (Fase 6f) + stock photos (já implementado Fase 5) cobrem.

### Fase 10i — Avaliações Google → posts (item 20 pitch)
- [ ] Job semanal: lê reviews 5★ novos via Google Business Profile API.
- [ ] Filtra por sentimento positivo + ortografia mínima.
- [ ] Gera template post "depoimento" via Gemini com a citação real + nome (com consentimento ou primeiro nome só).
- [ ] Enfileira pra aprovação normal Fase 6.

### Fase 10j — Posts contextuais por tendência (item 21 pitch)
- [ ] Scraper RSS de blogs ópticos BR (CRO-SP, ABO, Vision Monday BR) — 1x/semana.
- [ ] Gemini resume + propõe tema do dia caso seja relevante pra ótica do tenant.
- [ ] Settings tem flag pra ativar/desativar.

### Handoff profissional
- [ ] **Treinamento dono**: call 30min mostrando PWA + vídeo Loom 5min de fallback ("como aprovar post no celular", "como cadastrar cliente", "como ler dashboard", "como editar FAQ bot").
- [ ] **Canal de suporte**: WhatsApp dedicado Maycon ↔ cliente. SLA resposta 24h dia útil.
- [ ] **Status page pública** (Fase 10c) — cliente confere uptime sem precisar perguntar.

**Sinal de pronto Fase 10:** cliente faz 1 ciclo completo sozinho (aprova post no celular → publica no Instagram → recebe métricas → vê recall disparado → recebe relatório PDF mês) sem ajuda do Maycon.

---

## Fase 11 — Operacional contínuo (item 7, 16, 18 pitch — incluso no R$297/mês)

Sem código novo, mas comprometido contratualmente. Maycon gasta ~4-6h/mês por cliente Premium.

- [ ] **Atualização constante** (item 7) — acompanhar mudanças Instagram algoritmo, ajustar prompts Gemini, manter library de temas atualizada.
- [ ] **Manutenção bot WhatsApp 24h** (item 16) — monitorar conversas, ajustar FAQ, retreinar prompt quando bot errar.
- [ ] **Consultoria de ROI mensal** (item 18) — call 30-45min com cliente analisando relatório do mês, propondo 2-3 ajustes pro próximo (regras pro Gemini, recall pra subset de clientes, post temático). Documentado em `tenants.metadata.monthly_reviews`.

---

## Riscos conhecidos

- **Meta Business Manager** pode travar 24-72h pra aprovar. Plano B = Twilio.
- **Gemini free tier:** 15 req/min, 1500/dia. OK pra 1 cliente. Monitorar a partir de 5+.
- **Instagram Graph API** deprecia endpoints sem aviso. Subscrever changelog.
- **VPS Hostinger** SLA ~99.5%. Suficiente pra MVP.
- **Foto óculos baixa qualidade:** Nano Banana não salva imagem ruim. Validar com cliente antes.

---

## Sinal de pronto pra cliente

Fase 8: passar 7 dias seguidos gerando + aprovando posts da Di Lorenzo em staging sem intervenção manual (não publica no Instagram real ainda).

Depois: reunião com cliente → coleta Fase 9 → tenant real → 7 dias em produção paralela (gera mas não publica) → libera publicação automática.

---

## Caminho até virar produção real

Hoje → 4 ✅ → 5 ✅ (cron GH Actions) → 6a ✅ backend → **6b/c/d/e/f PWA** → 7 (landing + galeria + QR code) → **pré-0b (kickoff)** → 0b (VPS) → 8 (deploy) → 9 (cliente entrega tokens + brand + FAQ) → 10a-j (integração ondas) → 11 (operacional contínuo).

**Cliente Di Lorenzo já fechou (2026-05-28).** pré-0b oficialmente done — contrato/LGPD ainda precisam ser formalizados por escrito.

**Fast-track ativo:** Fase 6a backend done. Fase 6b PWA `/aprovar` é próxima entrega. Quando rodando, Maycon manda email mockup pro cliente ver no celular dele → cliente já vê o produto vivo + começa a juntar tokens.

**Custo recorrente real do projeto (1 cliente Premium):**
- Hostinger KVM 2 — R$30/mês
- Domínio Registro.br — R$3,30/mês (R$40/ano)
- Cloudflare — R$0 (free tier)
- Backblaze B2 — R$0 (≤10GB)
- Resend — R$0 (≤3k email/mês)
- Gemini API paid — ~R$3/mês (estimado se passar do free tier)
- WhatsApp Cloud API Meta — R$0 (≤1k conversas/mês)
- **Total: ~R$36/mês = 12% da receita R$297**
- **Margem bruta: 88% (R$261)**
- VPS aguenta 5-10 tenants Premium no mesmo plano. Margem só sobe com escala.
