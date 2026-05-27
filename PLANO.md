# PLANO

Roadmap de execução. Mandatos técnicos em [`CLAUDE.md`](CLAUDE.md). Visão geral em [`README.md`](README.md).

---

## Status (2026-05-27)

**Modo:** FREE TIER. Cliente Di Lorenzo pagou Premium mas ainda não confirmou início. Zero gasto com VPS/domínio até confirmação.

| Fase | Escopo | Status |
|---|---|---|
| 0a | Contas grátis Gemini + Resend | ✅ chaves em `backend/.env` + backup Bitwarden |
| 1 | Foundation (FastAPI, Docker, CI, structlog, /health) | ✅ |
| 2 | Schema SQL + seed calendário BR + tenant Di Lorenzo | ✅ validado em Postgres 16 nativo Win |
| 3 | Pipeline render IA→JPEG (Gemini + Playwright) | ✅ 5/5 temas, 24 testes, hardening (Pydantic models + repos + Protocol DI) |
| **4** | **`calendar.py` + `caption.py` + `post_generator.py`** | **⏭ ATIVA** |
| 5 | Fila RQ + cron diário (GitHub Actions enquanto não tem VPS) | pendente |
| 6 | Email Resend + PWA aprovação (`/aprovar/{token}` JWT magic link) | pendente |
| 7 | Landing Astro multi-tenant + galeria preview dos posts | pendente |
| 0b | [VPS] assinar Hostinger + domínio + Cloudflare + Backblaze B2 | depende cliente confirmar |
| 8 | [VPS] Deploy produção (Docker, Nginx, Let's Encrypt, GH Actions SSH) | depende 0b |
| 9 | Cliente entrega tokens (Instagram, brand kit, fotos, WhatsApp, CSV clientes) | bloqueado |
| 10 | Integração final (Instagram Graph, bot WhatsApp, recall, dashboard) | depende 9 |

Schema SQL real: `backend/app/db/migrations/0001_initial.sql`. Estrutura do repo: `CLAUDE.md`. Aprendizados Fase 3: commit `83ccab5`.

---

## Fase 4 — Geração de conteúdo (1 dia, ATIVA)

Objetivo: pipeline diária que pega data → tema → caption + HTML → JPEG → grava em `posts`.

- [ ] `services/calendar.py` — `resolve_theme(date) -> ThemeContext`. Lookup `holidays_br.get_holiday_by_date`. Fallback = pool orgânico (~15 temas óticos rotacionados deterministicamente por `date.toordinal()`).
- [ ] `services/caption.py` — Gemini → `PostCopy(caption, hashtags, cta)`. JSON output + Pydantic validate. `ModelClient` Protocol pra DI (mesmo padrão de `template_generator`). Retry se JSON malformado.
- [ ] `db/repositories/posts.py` — `create_post(...)` tipado. `get_tenant_id_by_slug` em `tenants.py`.
- [ ] `services/post_generator.py` — orquestra `resolve_brand → resolve_theme → generate_copy → generate_post_html → render_html_to_jpeg → grava arquivo → repo.create_post`. JPEG em `backend/tmp/posts/{post_id}.jpg` (Fase 8 migra pra storage externo).
- [ ] Endpoint dev `POST /dev/generate-post` body `{tenant, date}` → retorna `{post_id, theme, image_url, caption_preview}`.
- [ ] Tests fast: `test_calendar`, `test_caption`, `test_post_generator` (fakes), `test_posts_repo` (marker db).
- [ ] Smoke `scripts/smoke_fase4.py` — 30 datas seguidas (2026-06-01 → 2026-06-30). Verifica zero repetição de tema e grava metadata.json.

**Sinal de pronto:** 30 dias rodados sem repetir tema. JPEGs + captions gravados. Tests passam.

---

## Fase 5 — Fila e agendamento

Dois modos:

**Dev/demo (GitHub Actions cron, sem VPS):**
- [ ] Workflow `.github/workflows/daily-post.yml` cron `0 9 * * *` (06h Brasília).
- [ ] Job sobe Postgres + Python, roda `python -m backend.scripts.generate_demo_post`.
- [ ] Commita JPEG + metadata.json em `previews/YYYY-MM-DD/`.
- [ ] GitHub Pages serve `/previews/...`.

**Produção (RQ + Redis no VPS, Fase 8):**
- [ ] Worker RQ + RQ-scheduler. Job `generate_daily_post(tenant_id, date)` cron 06h. Job `publish_to_instagram(post_id)` cron 12h.
- [ ] Retry + dead-letter queue.
- [ ] Endpoint dev `GET /dev/queue/status`.

---

## Fase 6 — Email aprovação + PWA

- [ ] `services/email.py` (Resend), `services/jwt.py` (magic link 24h).
- [ ] Template email HTML responsivo (Jinja2).
- [ ] Endpoints `GET/POST /api/posts/{token}` (approve / reject).
- [ ] PWA React + Vite + Bootstrap 5 em `pwa/` (criar). Rota `/aprovar/:token`. Service worker + manifest (instalável).
- [ ] Build PWA → `pwa/dist/` → GitHub Pages serve em `/app`.
- [ ] Backend local + ngrok pra E2E sem VPS.
- [ ] Teste manual: receber email mockup → aprovar no celular.

---

## Fase 7 — Landing pública + galeria preview

- [ ] Astro em `landing/`. Template multi-tenant (hero, produtos, sobre, WhatsApp, mapa). Dados em `landing/data/<slug>.json`.
- [ ] SEO: meta tags + Schema.org JSON-LD (LocalBusiness + Optician) + sitemap.
- [ ] Build → GitHub Pages `/dilorenzo`.
- [ ] Galeria pública `/preview` com 30 posts gerados (Fase 5 alimenta).
- [ ] Lighthouse 95+.

---

## Fase 0b — Setup pago [VPS] (após cliente confirmar)

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

## Fase 10 — Integração final (depende Fase 9)

- [ ] `services/instagram.py` publicar via Graph API + webhook métricas.
- [ ] Onboarding completo no PWA (upload logo, fotos, OAuth Instagram).
- [ ] Bot WhatsApp Cloud API: webhook + parser de intenção (Gemini) + respostas.
- [ ] Recall WhatsApp: job semanal varre `clients`, dispara template.
- [ ] Dashboard métricas (Recharts ou ECharts).

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

Hoje → Fase 4 → 5 → 6 → 7 (final do free tier; landing Di Lorenzo + galeria 30 posts no ar, email aprovação funcional) → demo serve gatilho pro cliente liberar Instagram + WhatsApp → 0b → 8 → 9 → 10 → produção.
