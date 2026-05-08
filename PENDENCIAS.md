# 📋 Pendências — VisaoPost React App

> Última atualização: 2026-05-08

---

## ✅ O que já está feito

- [x] Migração completa do `apresentacao.html` → `src/components/PresentationPage.jsx`
- [x] Paridade visual com o HTML original (tema Dark Luxury, cores, espaçamentos)
- [x] Seções migradas: Hero, Fluxo, Números, Inovação, Estratégia, WhatsApp, Preços, Demo Instagram, Footer
- [x] Wizard de geração de contrato (3 steps: Documento → Informações → Sucesso)
- [x] Animações com `framer-motion` (entrance scroll, modal AnimatePresence)
- [x] Ícones via `lucide-react`
- [x] Projeto Vite + React configurado e rodando localmente (`npm run dev`)
- [x] Build de produção funcionando (`npm run build`)

---

## 🔴 Pendências críticas

### 1. Integração com API / Backend
- [ ] O botão "Gerar Proposta" no step 3 do wizard **não envia dados para lugar nenhum**
- [ ] Conectar o `handleSubmit` a um endpoint real (ex: `POST /api/contracts`)
- [ ] Salvar: nome, e-mail, CPF/CNPJ, plano escolhido, data

### 2. Deploy no Vercel
- [ ] Conectar repositório GitHub ao painel do Vercel
- [ ] Configurar `Build Command: npm run build` e `Output Directory: dist`
- [ ] Verificar propagação de domínio após deploy

---

## 🟡 Melhorias planejadas

### 3. Seções ainda incompletas/simplificadas no React
- [ ] **Seção WhatsApp Demo**: a imagem do avatar da Ótica Di Lorenzo está como base64 no HTML original — no React ainda não está renderizando o avatar corretamente (está usando placeholder)
- [ ] **Seção Demo Instagram (Antes/Depois)**: grade de posts mockados ainda não foi implementada com imagens reais ou assets visuais
- [ ] **Footer**: links sociais e mapa de site ainda precisam ser finalizados

### 4. Conteúdo dinâmico
- [ ] Mover constantes de planos (`plans[]`) e features (`innovations[]`) para um arquivo separado `src/data/content.js`
- [ ] Mover paleta de cores para `src/styles/theme.js`

### 5. SEO
- [ ] Adicionar meta tags (description, og:image, og:title) no `index.html`
- [ ] Configurar título da página dinamicamente

### 6. Responsividade
- [ ] Testar e ajustar breakpoints mobile (< 480px) em todos os cards de preço
- [ ] Testar seção de estratégia (3 colunas) em tablets

---

## 📁 Arquivos relevantes

| Arquivo | Descrição |
|---|---|
| `src/components/PresentationPage.jsx` | Componente principal da página |
| `src/App.jsx` | Entry point React |
| `apresentacao.html` | Referência original (HTML legado) |
| `landing_dilorenzo.html` | Landing page da Di Lorenzo (arquivo separado) |
| `vite.config.js` | Configuração do build |

---

## 🚀 Como rodar localmente

```bash
npm install
npm run dev
# Acessa: http://localhost:5173
```

## 📦 Como buildar para produção

```bash
npm run build
# Output em: /dist
```
