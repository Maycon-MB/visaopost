# VisaoPost — Painel Admin (PWA)

PWA mobile-first para dono da ótica aprovar posts, gerir clientes, ver dashboard e configurar o serviço.

## Stack

- React 18 + Vite 5 + TypeScript
- Bootstrap 5 (CSS apenas, sem JS)
- react-router-dom 6, vite-plugin-pwa
- ECharts (via echarts-for-react)
- Playwright (E2E)

## Setup local

```bash
cd frontend/painel
npm install
npm run dev        # http://localhost:5173
```

Pré-requisito: backend em `localhost:8000` (`uvicorn app.main:app --reload`).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Dev server HMR em :5173 |
| `npm run build` | Bundle de produção em `dist/` |
| `npm run preview` | Serve `dist/` localmente |
| `npm run test:e2e` | Testes Playwright (requer dev server rodando) |

## Build de produção

```bash
npm run build
# dist/ vai para /app no VPS via nginx
```

Meta de bundle: < 200 KB gzip total.

## Qualidade

- TypeScript em todos os componentes
- Playwright E2E em `e2e/`
- `npm audit` sem vulnerabilidades críticas/altas
- CSP configurado em `index.html`
- PWA instalável (Add to Home Screen iOS/Android)
- Dark mode via `[data-theme="dark"]`
- `prefers-reduced-motion` respeitado

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```
VITE_API_URL=http://localhost:8000
VITE_GALLERY_URL=http://localhost:4321/galeria/
VITE_CATALOG_URL=http://localhost:4321/catalogo/
VITE_QR_PRINT_URL=http://localhost:8000/recall/qr/dilorenzo/print
```
