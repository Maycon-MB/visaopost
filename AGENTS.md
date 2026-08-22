# AGENTS.md

Arquivo de mandatos pra ferramentas de IA (Antigravity, Codex, Cursor, etc.).

**Fonte de verdade:** [`CLAUDE.md`](CLAUDE.md) — mandatos técnicos completos (stack, convenções de código, o que NÃO fazer, estrutura do repo, ordem de desenvolvimento, sinais de pronto).

**Roadmap detalhado:** [`PLANO.md`](PLANO.md) — 10 fases com status, decisões, aprendizados.

**Visão geral do projeto:** [`README.md`](README.md).

## Ponto crítico pra qualquer AI

`archive/pitch/` ≠ `frontend/painel/`. Não confundir:
- `archive/pitch/` = apresentação institucional de venda (React+Vite+Framer Motion), fonte da verdade do escopo prometido ao cliente. Não é produto rodando, é material comercial arquivado.
- `frontend/painel/` = PWA admin real do dono (React+Vite+Bootstrap 5) — aprovação de posts, clientes, relatório, reels. Isso é o produto.
- `frontend/site/` = landing pública Astro (catálogo, galeria, institucional da ótica).

Leia `CLAUDE.md` antes de propor mudanças.
