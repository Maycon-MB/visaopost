# Projeto VisaoPost

SaaS B2B automação Instagram + WhatsApp + landing pra óticas. Cliente piloto Ótica Di Lorenzo (Premium R$297/mês, fechou 2026-05-28). Roadmap em [`PLANO.md`](PLANO.md). Pitch (fonte da verdade do escopo) em [`pitch/`](pitch/).

## Modo de trabalho

- **Caveman mode default.** Código/commits/PRs em português normal.
- **Siga `PLANO.md`.** Não pule fase sem dizer.
- **Decida sozinho** quando o caminho for óbvio. Pergunte apenas em ações irreversíveis (push, destrutivo, gasto $) ou trade-off não-óbvio.

## Decisões já tomadas (não me proponha revisar)

- **Stack consolidada num VPS Hostinger.** Sem Supabase, Vercel, Cloudflare Pages, Railway. Tudo no mesmo servidor.
- **Zero ORM.** SQL puro em `backend/app/db/repositories/`. Repositories devolvem Pydantic, `asyncpg.Record` morre na borda.
- **Multi-tenant:** toda query filtra por `tenant_id`. Exceção única: `holidays_br`.
- **IA texto:** `gemini-flash-latest`. **IA imagem:** `gemini-2.5-flash-image` (Nano Banana — edita foto real do cliente, nunca gera do zero).
- **Email Resend, WhatsApp Cloud API Meta direto, Instagram Graph API.**
- **PWA do dono:** React 18 + Vite + Bootstrap 5 mobile-first. **Landing:** Astro 5 + Tailwind.
- **Imagens posts:** 1080×1080 JPEG q90.

## Inegociáveis

- `.env` nunca commitado.
- Dev endpoints `/dev/*` só carregam quando `APP_ENV=dev`.
- Dependências externas (Gemini, Resend, IG, WA) atrás de `Protocol` pra testes.
- Migrations idempotentes em `backend/app/db/migrations/NNNN_*.sql`.

## Como testar

De `backend/`:
```powershell
.\.venv\Scripts\python.exe -m pytest -m "not slow and not db" -v
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Markers: `slow` (Playwright), `db` (Postgres real). Bug em smoke vira teste antes de fechar fase.
