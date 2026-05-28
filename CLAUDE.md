# Projeto VisaoPost

SaaS B2B automação Instagram + WhatsApp + landing pra óticas. Cliente piloto Ótica Di Lorenzo (Premium R$297/mês, fechou 2026-05-28). Roadmap em [`PLANO.md`](PLANO.md). Pitch (fonte da verdade do escopo) em [`pitch/`](pitch/).

## Modo

- Caveman mode default. Código/commits/PRs em português normal.
- Siga [`PLANO.md`](PLANO.md). Não pule fase sem dizer.
- Decida sozinho. Pergunte só em irreversíveis (push, destrutivo, gasto $).

## Decisões já tomadas (não me proponha revisar)

- Stack consolidada num **VPS Hostinger**. Sem Supabase/Vercel/Railway/Cloudflare Pages.
- **Zero ORM.** SQL puro em `backend/app/db/repositories/`. Repos devolvem Pydantic, `asyncpg.Record` morre na borda.
- **Multi-tenant:** toda query filtra por `tenant_id`. Exceção única: `holidays_br`.
- IA: `gemini-flash-latest` (texto), `gemini-2.5-flash-image` (Nano Banana, imagem).
- Email Resend. WhatsApp Cloud API Meta. Instagram Graph API.

## Inegociáveis

- `.env` nunca commitado.
- Rotas `/dev/*` só carregam quando `APP_ENV=dev`.
- Dependências externas atrás de `Protocol` pra testes injetarem fake.
- Migrations idempotentes em `backend/app/db/migrations/NNNN_*.sql`.
