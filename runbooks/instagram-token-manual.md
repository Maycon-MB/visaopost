# Token do Instagram na mão — fallback

**Não é o caminho normal.** O normal é o botão "Conectar Instagram" no painel ([`instagram_auth.py`](../backend/app/api/instagram_auth.py)), que faz login, escolhe a Página e salva o token de longa duração sozinho.

Use este documento só quando o OAuth não puder ser usado: túnel indisponível, app da Meta com problema de configuração, ou depuração pontual.

Para a configuração de verdade, com cliente: [`instagram-presencial.md`](instagram-presencial.md).

---

## Pré-requisitos

Valem para qualquer caminho, OAuth ou manual, e são feitos pelo dono da conta:

1. Instagram convertido em conta **Profissional → Empresa**, categoria Ótica.
2. Instagram vinculado a uma **Página do Facebook** da ótica.
3. Conta Instagram adicionada ao **Meta Business Manager**.

E, com o app em modo desenvolvimento: `marcelo107k@gmail.com` precisa ter cargo de **desenvolvedor** no app VisaoPost (ID `891876360640132`), em [App Roles](https://developers.facebook.com/apps/891876360640132/roles/roles/), e ter aceitado o convite.

---

## Gerar o token

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer) → aplicativo **VisaoPost**, usuário do Marcelo.
2. Permissões: `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `pages_read_engagement`.
3. **Gerar token de acesso** → autorizar no popup. Aceitar todas — recusar uma quebra a publicação depois, com o sintoma aparecendo longe da causa.
4. Trocar por token de 60 dias:

```
GET /oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={TOKEN_CURTO}
```

`{APP_ID}` e `{APP_SECRET}` saem de `backend/.env` (`META_APP_ID` / `META_APP_SECRET`). Nunca colar valor literal em arquivo versionado.

## Descobrir o Business Account ID

```
GET /{PAGE_ID}?fields=instagram_business_account
```

Devolve `{"instagram_business_account": {"id": "17841..."}}`. Se vier vazio, os pré-requisitos 1 ou 2 não foram concluídos de verdade.

## Salvar

```
INSTAGRAM_ACCESS_TOKEN=EAA...
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841...
```

## Testar

```bash
curl -X POST http://localhost:8000/dev/instagram/publish-test \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://picsum.photos/1080/1080", "caption": "Teste VisaoPost"}'
```

A `image_url` precisa ser **pública** — quem baixa a imagem são os servidores da Meta, não o navegador.

---

## Erros

| Problema | Causa | Solução |
|---|---|---|
| `instagram_business_account` vem vazio | Conta ainda Pessoal, ou não vinculada à Página | Refazer pré-requisitos 1 e 2 |
| `(#10) Not enough permission` | Escopo recusado no login | Revogar o token e gerar de novo aceitando todos |
| `(#200) Permissions error` | Sem cargo no app, ou convite não aceito | Conferir App Roles |
| `(#190)` | Token expirado ou revogado | Gerar de novo |
| `(#368)` | **Conta bloqueada por política** | **Parar.** Insistir agrava a punição. Anotar o `fbtrace_id` e abrir recurso em facebook.com/support |
| `(#4)`, `(#17)`, `(#32)`, `(#613)` | Cota estourada | Esperar a virada da hora. Não insistir |
| Aviso de restrição no Business Manager | Conta sinalizada pela Meta | **Investigar antes de prosseguir.** Restrição de anúncios normalmente não bloqueia publicação orgânica, mas esta conta já foi restringida de verdade — confirmar o escopo em facebook.com/support antes de tentar publicar |

A tradução desses códigos para português está em [`instagram_preflight.py`](../backend/app/services/instagram_preflight.py) e já aparece no painel.

---

## Expiração

Token de usuário dura 60 dias. `check_instagram_token_expiry` ([`tasks.py`](../backend/app/workers/tasks.py)) avisa 7 dias antes. Conferir manualmente:

```
GET /debug_token?input_token={TOKEN}&access_token={APP_ID}|{APP_SECRET}
```
