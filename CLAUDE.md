# Projeto VisaoPost — Mandatos

SaaS B2B de automação de Instagram para óticas. Piloto: Ótica Di Lorenzo (Premium).
Multi-tenant desde o primeiro commit. Roadmap em [`PLANO.md`](PLANO.md). Visão em [`README.md`](README.md).

---

## Modo de trabalho

- **Caveman mode é o default** — respostas terse, drop articles/filler/hedging. Código, commits e PRs em português normal.
- **Siga a ordem de fases do `PLANO.md`.** Cada fase tem sinal de pronto explícito lá. Não pule fase sem dizer.
- **Você julga sozinho** o escopo de testes, refactor cosmético, organização interna de arquivos, ordem de commits. Pergunte só em ações irreversíveis (push, destrutivas, gasto $) ou quando o trade-off não for óbvio.

---

## Stack

- **Backend:** Python 3.13 + FastAPI + Pydantic v2 + `asyncpg` + Playwright + RQ/Redis.
- **Frontend:** PWA do dono = React 18 + Vite + Bootstrap 5 (mobile-first). Landing pública = Astro 5 + Tailwind.
- **DB:** PostgreSQL 17 prod, 16+ dev nativo Windows (`.venv` em `backend/.venv/`). Redis 7 prod; dev opcional até Fase 5.
- **IA texto:** `gemini-flash-latest` (Gemini SDK). **IA imagem:** `gemini-2.5-flash-image` (Nano Banana — edita foto REAL do cliente, nunca gera do zero pra produto).
- **Externas:** Email Resend. WhatsApp Cloud API Meta (Twilio só fallback). Instagram Graph API. DNS Cloudflare proxy.
- **Deploy:** Docker Compose no VPS Hostinger Ubuntu 24.04 + Nginx + Certbot. CI: GitHub Actions.

---

## Inegociáveis

- **Multi-tenant:** toda query filtra por `tenant_id`. Exceção única: `holidays_br`.
- **Zero ORM.** SQL puro em `backend/app/db/repositories/`, uma função por consulta, uma por tabela. Nada de SQL inline em endpoint ou service.
- **Repositories devolvem Pydantic.** `asyncpg.Record` morre na borda do repo. Service expõe modelo agregado (ex.: `BrandKit`, `ThemeContext`), não N kwargs primitivos.
- **Imagens:** 1080×1080 JPEG q90. WebP só na landing pública.
- **Segredos via `.env`.** Nunca hardcoded, nunca commitado.
- **Dev endpoints gated:** rotas `/dev/*` só carregam quando `APP_ENV == "dev"`.
- **DI via `Protocol`:** dependências externas (Gemini, Resend, IG) atrás de `Protocol` pra testes injetarem fake sem mock global.
- **Logs estruturados** via `structlog`, sempre incluindo `tenant_id`.
- **Migrations idempotentes** em `backend/app/db/migrations/NNNN_descricao.sql` (`ON CONFLICT DO NOTHING`, `IF NOT EXISTS`).

---

## Como testar (Fase 3+)

Sempre de `backend/`, venv em `.venv/Scripts/python.exe`.

```powershell
.\.venv\Scripts\python.exe -m pytest -m "not slow and not db" -v   # rápido, sem rede
.\.venv\Scripts\python.exe -m pytest -m "db" -v                    # Postgres real
.\.venv\Scripts\python.exe -m pytest -m "slow" -v                  # Playwright
.\.venv\Scripts\python.exe scripts\smoke_faseN.py                  # E2E (consome quota)
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload        # http://localhost:8000
```

Bug encontrado em smoke vira teste automatizado antes de marcar a fase como done.

---

## O que NÃO fazer

- ORM (SQLAlchemy, Tortoise, etc.).
- Supabase, Vercel, Cloudflare Pages, Railway — tudo consolidado no VPS Hostinger.
- WhatsApp pessoal — apenas número Meta Business dedicado.
- Commitar artefatos gerados (`post.jpg`, `approval.html`, `_logo_b64.txt`, `backend/tmp/`).
- Subir assets do cliente (fotos óculos, paleta, logo) no repo — vão pro VPS ou storage externo.
- Painel admin na Fase 1 — usa `psql` ou DBeaver direto.
- Instalar dependência sem atualizar `requirements.txt`.
