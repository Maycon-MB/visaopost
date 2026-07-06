# Configuração Instagram — Ótica Di Lorenzo

> **Passos 5-8 (gerar token manual, salvar no `.env`) viraram fallback.**
> O fluxo normal agora é o botão "Conectar Instagram" no painel (`backend/app/api/instagram_auth.py`,
> Facebook Login for Business) — Marcelo faz login, escolhe a Page, pronto. Passos 1-4
> abaixo (conta Profissional, vincular Page, Business Manager) continuam obrigatórios
> antes de clicar em "Conectar Instagram", só o jeito de pegar o token que mudou.

**Duração estimada:** 30–45 min (com Marcelo na chamada ou presencial)  
**Quem faz o quê:**

- 🟠 **Marcelo** — logado no celular dele (Instagram + Facebook)
- 🔵 **Maycon** — logado no computador (developers.facebook.com)

---

## Pré-checklist

Antes de começar, confirmar com Marcelo:

- [ ] Sabe a senha do Instagram `@oticadilorenzo`
- [ ] Tem acesso ao Facebook com o e-mail `marcelo107k@gmail.com`
- [ ] Celular em mãos (para confirmar código 2FA se pedir)

---

## Passo 1 — Converter Instagram para conta Profissional

> 🟠 **Marcelo faz no celular**

1. Abrir Instagram → tocar na foto de perfil (canto inferior direito)
2. Tocar no ícone ☰ (três linhas, canto superior direito)
3. Ir em **Configurações e privacidade**
4. Ir em **Tipo de conta e ferramentas**
5. Tocar em **Mudar para conta profissional**
6. Selecionar categoria: **Loja de óptica** (ou "Produto/serviço" se não aparecer)
7. Selecionar tipo: **Empresa** (não Criador de conteúdo)
8. ✅ Conta agora é Profissional/Empresa

> **Sinal de sucesso:** aparece botão "Impulsionar publicação" no perfil e menu "Insights" nas publicações.

---

## Passo 2 — Vincular conta Instagram à Página do Facebook

> 🟠 **Marcelo faz no celular**

1. Ainda nas **Configurações e privacidade** do Instagram
2. Ir em **Conta** → **Contas vinculadas** → **Facebook**
3. Fazer login no Facebook com `marcelo107k@gmail.com`
4. Quando perguntar qual Página vincular → selecionar **"Ótica Di Lorenzo"**
   - Se não existir Página: criar em [facebook.com/pages/create](https://facebook.com/pages/create) antes (nome: "Ótica Di Lorenzo", categoria: Ótica)
5. ✅ Instagram vinculado ao Facebook

> **Sinal de sucesso:** no Instagram, em Contas vinculadas, aparece o nome da Página do Facebook.

---

## Passo 3 — Adicionar conta Instagram no Meta Business Manager

> 🟠 **Marcelo faz no computador ou celular**

1. Acessar [business.facebook.com](https://business.facebook.com) (logado como Marcelo)
2. Se não tiver Business Manager: clicar em **Criar conta** → nome "Ótica Di Lorenzo"
3. No painel do Business Manager:
   - Menu lateral → **Configurações do negócio** → **Contas** → **Contas do Instagram**
   - Clicar em **Adicionar** → **Conectar uma conta do Instagram**
   - Fazer login no Instagram `@oticadilorenzo`
4. ✅ Conta IG aparece no Business Manager

> ⚠️ Se aparecer aviso de "restrição de anúncios" — **ignorar**, não bloqueia publicação orgânica via API.

---

## Passo 4 — Adicionar Maycon como Developer no App VisaoPost

> 🔵 **Maycon faz no computador**

1. Acessar [developers.facebook.com/apps/891876360640132/roles/roles/](https://developers.facebook.com/apps/891876360640132/roles/roles/)
2. Clicar em **Adicionar pessoas**
3. Buscar por `marcelo107k@gmail.com`
4. Função: **Desenvolvedor**
5. Confirmar

> Isso dá ao Marcelo permissão para gerar tokens no app VisaoPost.

---

## Passo 5 — Gerar token de acesso com escopos Instagram

> 🟠 **Marcelo faz** (ou Maycon com Marcelo logado)

1. Acessar [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. No topo direito:
   - **Aplicativo:** selecionar **VisaoPost** (ID 891876360640132)
   - **Usuário ou Página:** selecionar o usuário do Marcelo
3. Em **Permissões**, adicionar:
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_insights`
   - `pages_read_engagement`
4. Clicar em **Gerar token de acesso** → autorizar no popup
5. Copiar o token gerado (começa com `EAA...`)

### Converter para token de longa duração (60 dias)

No campo de busca do Graph API Explorer, executar:

```
GET /oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={TOKEN_CURTO}
```

> `{APP_ID}` e `{APP_SECRET}` ficam em `backend/.env` (`META_APP_ID`/`META_APP_SECRET`) — nunca colar valor literal aqui ou em qualquer arquivo versionado.

Substituir `{TOKEN_CURTO}` pelo token gerado acima.  
Resposta: `{"access_token": "EAA...", "token_type": "bearer"}`  
→ Copiar esse novo token (dura 60 dias).

---

## Passo 6 — Obter o Instagram Business Account ID

Ainda no Graph API Explorer, executar:

```
GET /1106609362540434?fields=instagram_business_account
```

Onde `1106609362540434` é o ID da Página Facebook da Ótica Di Lorenzo.

Resposta esperada:
```json
{
  "instagram_business_account": {
    "id": "17841XXXXXXXXX"
  },
  "id": "1106609362540434"
}
```

→ Copiar o valor de `"id"` dentro de `instagram_business_account`.

> ⚠️ Se retornar `{}` vazio (sem o campo): voltar e confirmar Passos 1 e 2.  
> Causa mais comum: conta IG ainda Pessoal ou não vinculada à Page.

---

## Passo 7 — Salvar no backend

Abrir `backend/.env` e preencher:

```
INSTAGRAM_ACCESS_TOKEN=EAAMrKCWo1oQ...  (token longa duração do Passo 5)
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841XXXXXXXXX  (ID do Passo 6)
```

---

## Passo 8 — Testar publicação

Com o backend rodando (`docker compose up`):

```bash
curl -X POST http://localhost:8000/dev/instagram/publish-test \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://picsum.photos/1080/1080", "caption": "Teste VisaoPost #visaopost"}'
```

Resposta esperada: `{"media_id": "...", "permalink": "https://www.instagram.com/p/..."}`

Abrir o link e confirmar que o post apareceu em `@oticadilorenzo`.

---

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `instagram_business_account` não aparece | Conta IG é Pessoal | Passo 1 |
| `instagram_business_account` não aparece | IG não vinculado ao FB | Passo 2 |
| Token inválido / permissão negada | Escopos não selecionados | Repetir Passo 5 com todos os escopos |
| Token expirado após 60 dias | Token de usuário expira | Repetir Passo 5 ou migrar para System User |
| Erro `(#10) Not enough permission` | Escopos faltando | Revogar token, gerar novo com todos os escopos |
| Business Manager com restrição | BM flagged por anúncios | Não bloqueia publicação orgânica — ignorar |

---

## Renovação de token (a cada 60 dias)

Até implementar renovação automática: repetir Passo 5 antes do token expirar.  
A data de expiração pode ser verificada em:

```
GET /debug_token?input_token={TOKEN}&access_token={APP_ID}|{APP_SECRET}
```

`{APP_ID}` e `{APP_SECRET}` — mesmos valores de `backend/.env`, nunca colar aqui.
