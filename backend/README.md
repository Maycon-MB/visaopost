# backend/

FastAPI + asyncpg + Playwright + Gemini.

## Quickstart dev (Docker)

```powershell
# 1. Cria .env (copia do Bitwarden ou do .env.example)
copy .env.example .env
# edita .env: GEMINI_API_KEY, RESEND_API_KEY

# 2. Sobe stack
docker compose up --build

# 3. Testa
curl http://localhost:8000/health
curl http://localhost:8000/health/db
```

`/health/db` retorna versão Postgres + contagem de tenants + feriados. Sinal de pronto da Fase 2: ambas contagens > 0.

## Migrations

Postgres aplica `backend/app/db/migrations/*.sql` em ordem alfabética na 1ª vez que sobe (volume vazio). Se precisar refazer:

```powershell
docker compose down -v        # apaga volume (DESTRUTIVO em dev — perde dados)
docker compose up --build
```

## Inspeção via psql

```powershell
docker compose exec postgres psql -U visaopost -d visaopost

# Dentro do psql:
\dt                                   # lista tabelas
SELECT slug, business_name, plan FROM tenants;
SELECT date, name, theme FROM holidays_br ORDER BY date LIMIT 10;
SELECT count(*) FROM holidays_br;     # ~37 datas
\q
```

## Quickstart local (sem Docker)

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium
copy .env.example .env
uvicorn app.main:app --reload
```

## Layout

- `app/api/` — endpoints FastAPI
- `app/services/` — lógica de negócio (Gemini, Instagram, WhatsApp, render)
- `app/models/` — schemas Pydantic
- `app/db/pool.py` — pool asyncpg singleton
- `app/db/migrations/` — SQL puro, aplicado na ordem do nome
- `app/templates/` — HTML Jinja2 (posts + emails)
- `app/workers/` — jobs RQ
- `tests/` — pytest

## Convenções

- Todo query filtra por `tenant_id`. Sem exceção.
- SQL puro (sem ORM).
- `.env` nunca commitado.
- Logs JSON via structlog. `tenant_id` em todo evento.
