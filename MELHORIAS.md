# Melhorias pendentes — frontend

**Correção (22/08/2026):** a primeira versão deste arquivo foi escrita em
cima de um clone local desatualizado, com estrutura antiga
(`src/LandingPage.jsx` na raiz) que não existe mais. Esta versão reflete
o repositório real, com dois apps: `frontend/painel` (React + Vite,
dashboard do dono) e `frontend/site` (Astro, landing/catálogo público).

## `frontend/painel` — já está bem construído

TypeScript completo, dark mode de verdade (`theme-context.tsx`, com
`prefers-color-scheme`), split de bundle (`echarts-vendor` separado,
`rollup-plugin-visualizer` configurado), testes E2E reais em
`e2e/dashboard.spec.ts` (Playwright) cobrindo login, navegação, tema,
rota protegida. Acessibilidade tem cuidado real (`aria-label`,
`aria-expanded`, `aria-modal` em várias telas). Não precisa de ajuste
estrutural — só o item abaixo.

### Páginas grandes demais

`Dashboard.tsx` (645 linhas), `Clientes.tsx` (602), `Cotacao.tsx` (596),
`Apresentacao.tsx` (510), `Settings.tsx` (509), `Reels.tsx` (506) — seis
arquivos passando de 500 linhas, misturando busca de dado, estado, e
apresentação no mesmo arquivo.

**Ação:** extrair sub-componentes de seção pra `src/components/`, mover
lógica de busca/estado pra hooks próprios. Não é urgente — o código
funciona e tem teste — mas cada mudança futura nessas telas custa mais
tempo de leitura do que precisava.

## `frontend/site` — aqui sim tem trabalho real

Este app ficou pra trás do `painel` em três frentes:

### Sem TypeScript

`frontend/site` não tem `tsconfig.json` — é o único dos dois frontends
que ainda não migrou. Não é bug, mas é a maior causa provável dos outros
dois problemas abaixo (menos type-check, menos disciplina de padrão).

### Zero acessibilidade

Nenhum atributo `aria-*` em todo `src/`, e só 8 ocorrências de `alt=` no
app inteiro (`galeria.astro`, `catalogo.astro`, `LandingPage.jsx`). É a
parte do produto que clientes finais realmente veem — vale mais atenção
aqui do que no painel interno.

### Páginas monolíticas

`galeria.astro` (566 linhas), `catalogo.astro` (513), `LandingPage.jsx`
(388) — markup, lógica e estilo misturados no mesmo arquivo cada um.

**Ação sugerida, nessa ordem:** acessibilidade primeiro (impacto direto
em quem visita o site), depois quebrar as páginas grandes, TypeScript por
último (maior, adia sem custo imediato).

## Observação de consistência — não é bug, mas registra

A paleta de marca (`ochre #C1750B`, `rich-black #03191E`, `sage
#638475`) está definida duas vezes: `frontend/painel/src/styles.css`
(variável CSS) e `frontend/site/src/styles/theme.js` (objeto JS).
**Os valores batem exatamente hoje** — não é bug agora — mas são duas
fontes de verdade que podem divergir no futuro sem ninguém perceber, se
alguém mudar um cantinho da marca só num dos dois apps.

---
Corrigido após verificação contra o repositório real — documento apenas,
sem mudança de código.
