# pitch/

Apresentação institucional do produto. Canal ativo de venda — usada pra fechar Ótica Di Lorenzo (Premium) e reutilizável pra próximos prospects.

**Live:** https://maycon-mb.github.io/visaopost/

## Stack

- React 18 + Vite 4
- Framer Motion (animações)
- Lucide React (ícones)
- Vanilla CSS (sem framework de UI; design system próprio)

## Estrutura

```
pitch/
├── public/                Imagens estáticas (hero, óculos, vitrine, etc.)
├── src/
│   ├── data/content.js    ★ TEXTOS, PREÇOS, FEATURES — editar aqui na maioria das vezes
│   ├── styles/theme.js    Tokens visuais (cores, fontes, espaçamento)
│   ├── index.css          Reset + estilos globais
│   ├── components/
│   │   ├── LandingPage.jsx, PresentationPage.jsx, Footer.jsx, ValueDetailModal.jsx
│   │   └── sections/      Uma seção por arquivo (Pricing, Marketing, Problem, etc.)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js         Output configurado pra ../docs/ (GitHub Pages)
```

## Rodar em dev

```powershell
cd pitch
npm install
npm run dev
# → http://localhost:5175/visaopost/
```

## Buildar e publicar

`vite.config.js` aponta `outDir` pra `../docs/`. `npm run build` sobrescreve a apresentação publicada.

```powershell
cd pitch
npm run build                 # sobrescreve ../docs/

cd ..
git add docs/ pitch/
git commit -m "design: <descrição da mudança>"
git push                      # GitHub Pages atualiza em ~1min
```

## Customizar pra um prospect novo

A maioria das edições por cliente vive em `src/data/content.js` (planos, ideias de inovação, FAQs, etc.). Estratégias possíveis:

### Opção 1 — Versão pública genérica + branch por prospect (recomendada)

Mantém a versão publicada (main) como template "neutro" do produto. Pra cada prospect:

```powershell
git checkout -b pitch/otica-fulana
# edita pitch/src/data/content.js (substitui "Projeto" pelo nome da ótica, ajusta preços/promessas)
npm run build
git commit -am "pitch: versão Ótica Fulana"
git push -u origin pitch/otica-fulana
```

Você pode enviar ao prospect:
- Screenshots / PDF gerado da versão local (mais simples)
- Deploy temporário via Netlify Drop / Vercel CLI (1 comando, expira em dias)

### Opção 2 — Multi-tenant via query string (quando virar volume)

Refatora `content.js` pra carregar dados de `src/data/prospects/<slug>.json` lendo query string `?prospect=otica-fulana`. Resolve quando tiver 5+ prospects ativos. Por enquanto seria overengineering.

## Snapshots e rollback

Tag `pitch-v1-dilorenzo` marca a versão exata que fechou o cliente atual. Se uma mudança futura regredir o design:

```powershell
git checkout pitch-v1-dilorenzo -- pitch/ docs/
git commit -m "revert: voltar apresentação pra versão Di Lorenzo"
```

Sempre tagueie antes de uma rodada grande de redesign: `git tag pitch-v2-experimento && git push --tags`.

## O que NÃO mexer sem snapshot

- Paleta verde/dourado e tom premium — foi o que cativou o cliente atual.
- Estrutura das seções de preço (3 planos) — testada em pitch real.

## Relação com o produto principal

Esta pasta é **independente** do `backend/` (SaaS real). Compartilham repo só pra reduzir contas e domínios. O backend não importa nada daqui. Quando a Fase 7 (landing Astro multi-tenant) entrar no ar com domínio próprio, esta apresentação continua válida como pitch deck — mas a "landing de cliente" oficial passa a ser servida pelo backend.
