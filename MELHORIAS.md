# Melhorias pendentes — frontend

Levantamento feito comparando este frontend com outros projetos do mesmo
autor, focado em bug real e risco, não em preferência de estilo.

## 1. Paleta de cor duplicada, com valores diferentes

`src/styles/theme.js` define a paleta em JS (tema "SaaS" escuro e tema
"landing" mais claro). `src/index.css` define OUTRA paleta, via variável
CSS (`--lzo-dark`, `--lzo-orange`, `--lzo-gold`...), com hex ligeiramente
diferente dos mesmos nomes conceituais.

Duas fontes de verdade pra mesma marca divergem mais cedo ou mais tarde
sem ninguém perceber — é assim que uma tela fica com laranja diferente da
outra sem ninguém ter mudado nada de propósito.

**Ação:** decidir qual arquivo é a fonte real (checar com grep quem
realmente importa `theme.js` vs quem usa `var(--lzo-*)` nos componentes
de verdade), fazer o outro derivar dele. Se as duas paletas forem
intencionalmente diferentes pra contextos diferentes, documentar isso
explicitamente no próprio arquivo — não deixar implícito.

## 2. ESLint listado mas sem configuração

`package.json` tem `eslint` e plugins em devDependencies e um script
`lint`, mas não existe `.eslintrc*` nem `eslint.config.js` no repositório.
`npm run lint` falha hoje.

**Ação:** criar a configuração mínima pro stack (React 18 + Vite + JS,
sem TypeScript) usando os plugins já instalados, rodar o lint de verdade
e corrigir o que ele apontar.

## 3. Imagem hotlinkada do Imgur

`LandingPage.jsx` (~linha 293) usa `<img src="https://i.imgur.com/8Km9tLL.png">`.
Depender de host externo que o projeto não controla é risco de
disponibilidade — o Imgur pode remover, limitar taxa, ou trocar a imagem
sem aviso, e o site quebra sem nenhum commit ter mudado nada aqui.

**Ação:** baixar a imagem pro repositório (`src/assets/` ou `public/`,
seguindo o padrão que as outras imagens do projeto já usam) e trocar a
referência pra local.

## Observações de menor prioridade

- **Zero `aria-*`/`role` em todo o `src`** — só 4 tags `<img>` têm `alt`,
  e são genéricos ("Post", "Logo"). Não é bug, é acessibilidade ausente.
- **Sem lazy loading nem code splitting** — `Vite` dá build padrão, mas
  nada de `React.lazy`/`loading="lazy"` foi adicionado.
- Estilo pesado em `style={{}}` inline (122 ocorrências em
  `LandingPage.jsx`, 62 em `PresentationPage.jsx`) — funciona, mas
  dificulta manter tema consistente a longo prazo.

---
Gerado por revisão comparativa de frontend, sem mudança de código —
documento apenas.
