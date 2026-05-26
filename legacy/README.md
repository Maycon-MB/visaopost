# legacy/

Protótipo anterior à Fase 1 do projeto SaaS. **Não rodar em produção. Não referenciar a partir do código novo em `backend/`.**

Mantido aqui porque:

1. **Material de venda / pitch a clientes futuros** — apresentações HTML e React institucional usados pra fechar Di Lorenzo.
2. **Referência de design** — paleta, voz, tom visual que cativaram o cliente. Servem de inspiração quando a Fase 6 (PWA de aprovação) e Fase 7 (landing Astro) forem construídas.

## Conteúdo

| Pasta / arquivo | O que é | Vivo? |
|---|---|---|
| `demo/` | Scripts Python soltos (Pillow puro, sem Playwright/Gemini). Geraram os primeiros mockups de post + página de aprovação estática. | Não. Substituído por `backend/app/services/` (Fase 3). |
| `pwa-institutional/` | React 18 + Vite + Framer Motion + Vanilla CSS. Apresentação institucional do produto (não é o PWA de aprovação da Fase 6, que será React + Vite + Bootstrap 5). | Builda em `../docs/` que é servido pelo GitHub Pages. Rebuild manual via `npm run build`. |

## Itens relacionados que ficaram na raiz

Permanecem na raiz do repo porque são referências de design ainda úteis em pitches:

- `../apresentacao.html` — apresentação standalone usada pra mostrar o produto a leads.
- `../landing_dilorenzo.html` — landing mockup Di Lorenzo, prova-de-conceito visual.
- `../docs/` — output buildado de `pwa-institutional/`. Servido pelo GitHub Pages.

Quando a Fase 7 (landing Astro multi-tenant) estiver pronta, esses arquivos podem ser arquivados também.

## Como rodar (se realmente precisar)

```powershell
# Apresentação institucional React (legacy)
cd legacy/pwa-institutional
npm install
npm run dev                # dev server local
npm run build              # gera dist/ — copiar manual pra ../../docs/ se quiser publicar
                           # (vite.config.js não tem outDir configurado pra docs/)

# Scripts demo Pillow
cd legacy/demo
python generate_post.py
```

Lembrete: **nenhum desses scripts obedece os mandatos técnicos do `CLAUDE.md` atual** (multi-tenant, asyncpg, repositories, Pydantic). São protótipo descartável.
