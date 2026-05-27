# automacao_instagram

SaaS B2B de automação de marketing para óticas. Geração diária de posts Instagram via IA, aprovação em 1 clique, publicação automática, bot WhatsApp e recall de clientes.

**Piloto:** Ótica Di Lorenzo (plano Premium, pago).

---

## Status

| Fase | Escopo | Status |
|---|---|---|
| 0a | Contas grátis Gemini + Resend | ✅ |
| 1 | Foundation (FastAPI, Docker, CI) | ✅ |
| 2 | Schema SQL + seed calendário BR + tenant Di Lorenzo | ✅ validado em Postgres 16 nativo |
| 3 | Pipeline render IA→JPEG (Gemini + Playwright) | ✅ 5/5 temas, 24 testes |
| 4 | calendar.py + caption.py + post_generator.py | ⏭ próxima |
| 5-10 | Fila RQ, email, PWA, landing, Instagram, WhatsApp, dashboard | pendente |

Detalhes completos em [PLANO.md](PLANO.md).

---

## Stack

- **Backend:** Python 3.13, FastAPI, Pydantic v2, asyncpg, Playwright, Pillow, RQ + Redis
- **Frontend (Fase 6+):** PWA React + Vite + Bootstrap 5 / Landing Astro + Tailwind
- **DB:** Postgres 17 produção, Postgres 16 nativo Windows em dev
- **IA:** `gemini-flash-latest` (texto), `gemini-2.5-flash-image` (Nano Banana, edita foto óculos)
- **Deploy (Fase 8):** Docker Compose no VPS Hostinger Ubuntu 24.04, Nginx + Let's Encrypt, GitHub Actions

Mandatos técnicos completos em [CLAUDE.md](CLAUDE.md). Ferramentas de IA que não leem `CLAUDE.md` automaticamente: [AGENTS.md](AGENTS.md) é o pointer de entrada.

---

## Estrutura do repo

```
automacao_instagram/
├── backend/        ATIVO — FastAPI + asyncpg + Playwright + Gemini (Fase 1-3 done)
├── pitch/          Apresentação institucional (React + Vite). Canal ativo de venda.
├── docs/           Build live do pitch/ — servido pelo GitHub Pages em
│                   https://maycon-mb.github.io/visaopost/
├── legacy/         Protótipo Python pré-Fase 1 (scripts Pillow puros, descontinuados).
├── CLAUDE.md       Mandatos técnicos (ler 1º)
├── PLANO.md        Roadmap e status detalhado por fase
├── docker-compose.yml      Stack dev local (Postgres + Redis + backend + worker)
└── .github/workflows/      CI + futuro deploy SSH
```

Estruturas que ainda não existem (criadas em fases futuras): `pwa/` (Fase 6, PWA de aprovação), `landing/` (Fase 7, landing Astro multi-tenant), `nginx/` (Fase 8, configs produção).

---

## Rodar

### Backend (dev local, sem Docker)

Pré-requisito: Postgres 16 nativo Windows + Python 3.13.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium
copy .env.example .env
# edita .env: DATABASE_URL, GEMINI_API_KEY, RESEND_API_KEY (do Bitwarden)

# aplica migrations no Postgres 16 local
psql -U visaopost -d visaopost -f app/db/migrations/0001_initial.sql
psql -U visaopost -d visaopost -f app/db/migrations/0002_seed_calendar_br.sql
psql -U visaopost -d visaopost -f app/db/migrations/0003_seed_tenant_dilorenzo.sql

uvicorn app.main:app --reload
# → http://localhost:8000/health/db
# → http://localhost:8000/dev/preview/natal
```

Detalhes: [backend/README.md](backend/README.md).

### Tests

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest -m "not slow and not db" -v   # fast
.\.venv\Scripts\python.exe -m pytest -m "db" -v                    # integração Postgres
.\.venv\Scripts\python.exe -m pytest -m "slow" -v                  # Playwright real
.\.venv\Scripts\python.exe scripts\smoke_fase3.py                  # 5 temas Gemini → JPEG
```

### Apresentação institucional (pitch)

Editar e publicar a apresentação live (https://maycon-mb.github.io/visaopost/):

```powershell
cd pitch
npm install                  # 1ª vez
npm run dev                  # preview local em http://localhost:5175/visaopost/
npm run build                # gera ../docs/ direto (vite.config.js já aponta pra lá)

cd ..
git add docs/ pitch/
git commit -m "design: <descrição>"
git push                     # GitHub Pages atualiza em ~1min
```

Detalhes (estrutura, customização por prospect, snapshots): [pitch/README.md](pitch/README.md).

Tag `pitch-v1-dilorenzo` marca a versão que fechou o cliente atual — útil pra rollback.

---

## Planos do produto

| Plano | Setup | Mensalidade |
|---|---|---|
| Starter | R$800 | R$97 |
| Growth | R$1.000 | R$197 |
| Premium | R$1.500 | R$297 |

Cliente atual: Di Lorenzo (Premium).
