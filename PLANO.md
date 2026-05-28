# PLANO

Roadmap de execução. Mandatos técnicos em [`CLAUDE.md`](CLAUDE.md). Visão geral em [`README.md`](README.md).

---

## Status (2026-05-28)

**Modo:** FREE TIER. Cliente Di Lorenzo pagou Premium mas ainda não confirmou início. Zero gasto com VPS/domínio até confirmação.

| Fase | Escopo | Status |
|---|---|---|
| 0a | Contas grátis Gemini + Resend | ✅ chaves em `backend/.env` + backup Bitwarden |
| 1 | Foundation (FastAPI, Docker, CI, structlog, /health) | ✅ |
| 2 | Schema SQL + seed calendário BR + tenant Di Lorenzo | ✅ validado em Postgres 16 nativo Win |
| 3 | Pipeline render IA→JPEG (Gemini + Playwright) | ✅ 5/5 temas, 24 testes, hardening (Pydantic models + repos + Protocol DI) |
| 4 | `calendar.py` + `caption.py` + `post_generator.py` | ✅ done* (gate 30d migrado pra Fase 5) |
| **5** | **Retry 429 Gemini + GH Actions cron demo + RQ infra + queue endpoints** | **⏭ ATIVA** |
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

## Fase 6 — Email aprovação + PWA do dono

PWA mobile/tablet first em `pwa/` (React 18 + Vite + Bootstrap 5). Service worker + manifest (instalável). Build → `pwa/dist/` → GitHub Pages em `/app` (Fase 8 migra pra VPS). Auth via JWT magic link (sem senha).

**Critérios mobile/tablet first (não negociáveis):**
- Touch targets ≥ 44×44px (Apple) / 48dp (Google). Botão "aprovar" tem que ser impossível de errar com dedo.
- Breakpoints Bootstrap: celular (<576px) mostra essencial; tablet (≥768px) adiciona colunas/seções; desktop é bônus.
- Lighthouse mobile ≥ 95 (Performance + Accessibility + Best Practices).
- Bundle JS+CSS gzipped < 200KB. Imagens com `loading="lazy"`.
- Offline-first: service worker cacheia post pendente + tela aprovação. Sem net → consegue aprovar; sync depois.
- Email Resend renderiza bem em Gmail mobile + iOS Mail (tabela aninhada, max-width 600px, fontes ≥ 14px).
- Sem hover-only, sem fixed positioning agressivo (URL bar Safari iOS quebra).

**Aprovação de post:**
- [ ] `services/email.py` (Resend), `services/jwt.py` (magic link 24h).
- [ ] Template email HTML responsivo (Jinja2).
- [ ] Endpoints `GET/POST /api/posts/{token}` (approve / reject / regenerar).
- [ ] PWA rota `/aprovar/:token`. Botões aprovar + rejeitar + "gera outro com feedback X".
- [ ] Backend local + ngrok pra E2E sem VPS.

**Cadastro de clientes (`/clientes`) — independe de Instagram token, cliente pode usar dia 1:**
- [ ] Endpoints REST: `GET/POST/PATCH/DELETE /api/clients` + `POST /api/clients/import` (CSV).
- [ ] Tela `/clientes` no PWA: tabela com search + filtros (ativos, exame +12m, novos da semana).
- [ ] Formulário cadastro single: nome, telefone WhatsApp, email opcional, data último exame, observações.
- [ ] Import CSV: template baixável + upload + parser idempotente (UNIQUE tenant_id+phone já no schema).
- [ ] Botões linha: marcar contatado / marcar exame feito / opt-out.
- [ ] Export CSV (backup pro cliente).
- [ ] Validação: telefone formato BR, último exame ≤ hoje.

**Configurações básicas (`/settings`):**
- [ ] Migration adiciona em `tenants`: `send_hour`, `publish_hour`, `active_weekdays jsonb`, `extra_instructions text`.
- [ ] Tela `/settings`: horário envio email (default 06h), horário publicação (default 12h), dias ativos (default seg-sáb), instruções extras pro Gemini (campo livre).
- [ ] Worker RQ (Fase 5) lê tenant em runtime — sem hardcoded.

**Sinal de pronto:** Maycon recebe email mockup, aprova no celular. Cliente fictício cadastrado via tela + CSV. Settings persiste.

---

## Fase 7 — Landing pública + galeria preview

- [ ] Astro em `landing/`. Template multi-tenant (hero, produtos, sobre, WhatsApp, mapa). Dados em `landing/data/<slug>.json`.
- [ ] SEO: meta tags + Schema.org JSON-LD (LocalBusiness + Optician) + sitemap.
- [ ] Build → GitHub Pages `/dilorenzo`.
- [ ] Galeria pública `/preview` com 30 posts gerados (Fase 5 alimenta).
- [ ] Lighthouse 95+.

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

## Fase 9 — BLOQUEADO PELO CLIENTE

Cliente Di Lorenzo precisa entregar:
- Token Instagram Graph API (conta Business + Facebook Page vinculada).
- Brand kit: logo PNG fundo transparente + paleta + fontes + tom de voz.
- 10-20 fotos de óculos alta qualidade (input pro Nano Banana).
- Decisão WhatsApp: Cloud API Meta (preferido) ou Twilio. Se Cloud API → Business Manager verificado + número dedicado + display name approval.
- CSV/planilha clientes pra recall (nome, telefone, último exame).
- Email do dono pra notificações.
- Decisão de domínio (subdomínio vs próprio).
- Aprovação do tom de voz (testar 5 posts gerados antes de virar produção).
- Termo de uso de imagem dos produtos (LGPD).

---

## Fase 10 — Integração final + handoff profissional (depende Fase 9)

**Integrações:**
- [ ] `services/instagram.py` publicar via Graph API + webhook métricas.
- [ ] Onboarding completo no PWA (upload logo, fotos, OAuth Instagram).
- [ ] `/brand` no PWA — editar paleta, voz, fontes, logo (já tem campos no schema).
- [ ] `/assets` no PWA — galeria de fotos óculos (CRUD + tags).
- [ ] `/regras` no PWA — instruções extras pro Gemini (V1: campo texto livre. V2 depois com checkboxes).
- [ ] Bot WhatsApp Cloud API: webhook + parser de intenção (Gemini) + respostas.
- [ ] Recall WhatsApp: job semanal varre `clients`, dispara template Meta aprovado.
- [ ] Dashboard métricas no PWA (Recharts) — alcance, likes, salvos.
- [ ] Relatório mensal automático PDF (posts publicados + alcance total + recalls disparados) → email no dia 1 de cada mês.

**Handoff profissional:**
- [ ] **Treinamento dono**: call 30min mostrando PWA + vídeo Loom 5min de fallback ("como aprovar post no celular", "como cadastrar cliente").
- [ ] **Canal de suporte**: WhatsApp dedicado Maycon ↔ cliente. SLA resposta 24h dia útil.
- [ ] **Status page** simples: `/status` no backend retorna últimas 24h de health + posts publicados. Cliente acessa em `https://api.visaopost.com.br/status` (público read-only).

**Sinal de pronto:** cliente faz 1 ciclo completo sozinho (aprova post no celular → publica no Instagram → recebe WhatsApp confirmando) sem ajuda do Maycon.

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

Hoje → 4 → 5 (cron GH Actions) → 6 (PWA: aprovação + /clientes + /settings) → 7 (landing + galeria) → **pré-0b (reunião + contrato)** → 0b (VPS) → 8 (deploy) → 9 (cliente entrega tokens) → 10 (integração + handoff) → produção.

**Fast-track sugerido:** assim que Fase 6 estiver rodando (`/aprovar` mockup + `/clientes` CRUD + `/settings`), agendar conversa com cliente já — mostra PWA real funcionando, pega WhatsApp dele, ele começa a cadastrar contatos (zero atrito, não depende Instagram token). Cliente ganha valor antes de assinar Fase 0b.
