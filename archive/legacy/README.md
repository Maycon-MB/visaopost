# legacy/

Protótipo Python descontinuado, anterior à Fase 1 do SaaS. **Não rodar em produção. Não referenciar a partir do código novo em `backend/`.**

Mantido aqui pra histórico de design da geração de posts — geração de imagem via Pillow puro, antes da migração pra Playwright + Gemini.

## Conteúdo

| Pasta | O que é | Status |
|---|---|---|
| `demo/` | Scripts Python soltos (Pillow puro). Geraram os primeiros mockups de post + página de aprovação estática + agendamento `.bat`. | Não roda. Substituído por `backend/app/services/` (Fase 3). |

## Apresentação institucional

A apresentação React que costumava ficar aqui em `legacy/pwa-institutional/` foi promovida pra `../pitch/` — é canal ativo de venda, não legado. Live: https://maycon-mb.github.io/visaopost/.

## Se realmente precisar rodar

```powershell
cd legacy/demo
python generate_post.py
```

Lembrete: **nenhum desses scripts obedece os mandatos técnicos do `CLAUDE.md` atual** (multi-tenant, asyncpg, repositories, Pydantic). São protótipo descartável.
