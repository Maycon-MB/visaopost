# PWA do dono — VisaoPost

PWA mobile/tablet first pra dono aprovar posts gerados, gerir clientes (Fase 6c), configurar settings (Fase 6d), ver dashboard (Fase 6e) e administrar catálogo (Fase 6f).

Stack: React 18 + Vite 5 + Bootstrap 5 (CSS) + react-router-dom 6 + vite-plugin-pwa.

## Telas

| Rota | Fase | Status |
|---|---|---|
| `/aprovar/:token` | 6b | ✅ feito (esta entrega) |
| `/clientes` | 6c | pendente |
| `/settings` | 6d | pendente |
| `/dashboard` | 6e | pendente (skeleton) |
| `/produtos` | 6f | pendente |

## Dev local

```bash
cd pwa
npm install
npm run dev   # http://localhost:5173 (proxy /api → :8000)
```

Pré-requisitos:
- backend rodando em `localhost:8000` (`uvicorn app.main:app --reload`)
- CORS já liberado pra `localhost:5173` em `backend/app/main.py`

## Build produção

```bash
npm run build   # gera pwa/dist/
npm run preview # serve estático local
```

Fase 8 publica `pwa/dist/` em `/app` no Nginx VPS. Hoje, build vai pro GitHub Pages.

## Critérios mobile/tablet first (PLANO.md)

- Touch targets ≥ 56px (acima do mínimo 48dp).
- Bootstrap CSS only (sem JS bootstrap, sem popper.js) → bundle leve.
- Service worker via vite-plugin-pwa: cache `NetworkFirst` em `/api/posts/`, `CacheFirst` em imagens.
- Manifest + ícones SVG → instalável (Add to Home Screen no iOS/Android).
- `safe-area-inset-bottom` respeitado pra notch iPhone.

## E2E com email (Resend)

Pra Resend mandar email com URL pública, expor backend via ngrok:

```bash
ngrok http 8000
# copiar URL e usar em backend/.env como FRONTEND_URL=https://<ngrok>.ngrok.app
```

## Ícones

`public/icon-192.svg` e `public/icon-512.svg` são placeholders. Antes de produção, gerar PNGs reais com o logo final do cliente.
