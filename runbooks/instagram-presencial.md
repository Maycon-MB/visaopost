# Roteiro — conectar o Instagram, presencial, no celular do cliente

Runbook interno do Maycon. Documento do cliente é [`entregas/INSTRUCOES_CLIENTE.md`](../entregas/INSTRUCOES_CLIENTE.md).

**Objetivo da reunião:** sair de lá com um post publicado no Instagram da ótica pelo nosso sistema, com o Marcelo vendo acontecer.

**Regra que vale acima de tudo:** se travar, **para e remarca**. A conta dele já foi restringida pela Meta. Insistir na frente dele piora a restrição e queima confiança. Parar e voltar em 3 dias com o problema resolvido é um bom desfecho.

---

## Onde cada coisa acontece

| Aparelho | O que faz |
|---|---|
| **Celular do Marcelo** | Tudo. App do Instagram, navegador, login do Facebook |
| **Teu notebook** | Só roda o backend e o túnel. Fica fechado na mesa |

Ele nunca digita senha no teu computador. Isso importa mais do que parece para quem desconfia de tecnologia — e você pode falar isso em voz alta logo no começo.

---

## D-7 — ensaio completo, sozinho

A parte que mais reduz risco. Não pule.

1. Cria uma conta Instagram nova e converte pra Profissional.
2. Cria uma Página do Facebook no teu Facebook pessoal.
3. Vincula as duas.
4. Roda o fluxo inteiro **pelo teu próprio celular**, não pelo computador — é assim que vai ser no dia.
5. Publica a imagem de teste.
6. **Depois quebra de propósito:** revoga o acesso em Facebook → Configurações → Aplicativos e sites, e refaz. Você quer ter visto a tela de erro antes de vê-la na frente do cliente.

No fim você fez o fluxo duas vezes, no aparelho certo. É a diferença entre conduzir e improvisar.

---

## D-3 — dar cargo ao Marcelo no app

**Esta é a causa nº1 de falha e não tem sintoma óbvio.** Sem cargo, o login dele falha com erro de permissão que parece ser outra coisa completamente diferente.

### Por que precisa

O app VisaoPost está em **modo desenvolvimento** na Meta. Nesse modo, ele só funciona para pessoas que têm cargo declarado no app. Qualquer outra pessoa que tentar logar recebe erro de permissão — mesmo com a conta perfeitamente configurada.

Sair do modo desenvolvimento exige App Review da Meta (semanas de análise, e eles pedem vídeo demonstrando o uso). Enquanto isso não acontece, dar cargo ao Marcelo é o caminho, e é legítimo — é exatamente para isso que o modo desenvolvimento existe.

### Como fazer

1. Acesse [developers.facebook.com/apps/891876360640132/roles/roles/](https://developers.facebook.com/apps/891876360640132/roles/roles/) logado na tua conta.
2. Menu lateral esquerdo → **App Roles** → **Roles**.
3. Botão **Add People** (ou "Adicionar pessoas").
4. Escolha o cargo: **Testador**. É o menor privilégio que resolve. *Desenvolvedor* também funciona e é o que está no PLANO — os dois servem, Testador expõe menos.
5. Busque por `marcelo107k@gmail.com`.
   - **Não achou pelo e-mail?** É comum: a busca da Meta acha melhor por nome do Facebook ou pelo ID numérico. Peça o link do perfil dele no Facebook — o número na URL é o ID.
6. Confirme. O status fica **Pendente** até ele aceitar.

### Como ele aceita

A Meta manda um e-mail. **Esse e-mail cai em spam com frequência**, então não conte só com ele.

O caminho confiável é: com ele logado no Facebook, abrir [developers.facebook.com/requests](https://developers.facebook.com/requests). O convite pendente aparece ali, com um botão de confirmar. Funciona no celular.

Isso vale como plano B no dia, se o e-mail sumiu.

### Como confirmar que funcionou

Volte em **App Roles → Roles**. O nome dele tem que aparecer na lista **sem** a etiqueta "Pendente". Se ainda estiver pendente, ele não aceitou — e o login vai falhar na reunião.

- [ ] Convite enviado
- [ ] Convite aceito (verificado na lista, não no "acho que ele aceitou")

### Resto do D-3

- [ ] Mandar o [`INSTRUCOES_CLIENTE.pdf`](../entregas/INSTRUCOES_CLIENTE.pdf) e cobrar as 3 confirmações: senha do Facebook, senha do Instagram, print do status de restrição.
- [ ] **Restrição ativa? Não marque a reunião.** Resolve primeiro.

---

## D-1 — infraestrutura

O backend precisa estar acessível pela internet, senão nada funciona. Sem VPS, é túnel.

**Use Cloudflare Tunnel, não ngrok.** O ngrok grátis mostra uma tela de aviso antes de abrir o site — no celular do Marcelo, no meio do login, isso parece exatamente o golpe que ele teme. O Cloudflare não mostra nada.

```bash
cloudflared tunnel --url http://localhost:8000
```

Devolve algo como `https://verde-mesa-abc.trycloudflare.com`. **Essa URL muda toda vez que você sobe o túnel** — por isso este passo é do dia, não da véspera. Suba o túnel em casa, antes de sair, e não derrube mais.

Com a URL em mãos, no `backend/.env`:

```
META_OAUTH_REDIRECT_URI=https://verde-mesa-abc.trycloudflare.com/auth/facebook/callback
API_BASE_URL=https://verde-mesa-abc.trycloudflare.com
```

E cadastre a URL de callback na Meta: App → Facebook Login → Settings → **Valid OAuth Redirect URIs**. Leva 30 segundos e vale na hora.

Confira tudo de uma vez:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://verde-mesa-abc.trycloudflare.com/auth/facebook/preflight
```

**Todos os itens têm que voltar `ok: true`.** Cada falha traz a instrução de correção no campo `hint`. O item `mesmo_host` existe pra pegar o erro mais fácil de cometer: trocar de túnel e atualizar só uma das duas variáveis.

- [ ] Preflight todo verde
- [ ] Fluxo completo rodado de novo com a conta de teste, já com a URL final

---

## No dia — levar

- Notebook com backend e túnel **já rodando antes de sair de casa**
- 4G próprio ligado. Não depender do wifi da loja
- Carregador
- Este roteiro impresso
- A URL do túnel anotada num papel, pra digitar no celular dele

---

## A reunião

Reserve 1 hora. Costuma dar 30 minutos.

### Abertura (1 minuto)

> "São três coisas rápidas, tudo no seu celular. Você não digita senha em lugar nenhum além das telas oficiais do Instagram e do Facebook. No fim eu publico uma imagem de teste pra você ver funcionando, e a gente apaga."

### Passo 1 — Conta Profissional · celular dele · 2 min

App do Instagram → foto de perfil (canto inferior direito) → ☰ (canto superior direito) → **Configurações e privacidade** → **Tipo de conta e ferramentas** → **Mudar para conta profissional**.

- Categoria: **Loja de óptica** (se não achar, "Produto/serviço")
- Tipo: **Empresa** — não "Criador de conteúdo"

✅ **Confirma quando:** aparece o botão **Impulsionar publicação** no perfil dele.

> Se ele perguntar se muda algo: não. Ninguém é avisado, não perde seguidor. Ele só ganha estatísticas.

### Passo 2 — Vincular a Página do Facebook · celular dele · 5 min

Ainda em **Configurações e privacidade** → **Contas vinculadas** → **Facebook** → login → escolher a Página da ótica.

**Não existe Página?** Cria na hora, ali mesmo: "Criar nova Página", nome "Ótica Di Lorenzo", categoria Ótica. Leva 2 minutos.

✅ **Confirma quando:** o nome da Página aparece em Contas vinculadas.

> É aqui que a senha do Facebook é cobrada. Se ele não souber, acabou a reunião — por isso está no documento de preparação.

### Passo 3 — Aceitar o convite do app · celular dele · 1 min

Se ele já aceitou no D-3, pule. Se não:

Ele abre o e-mail `marcelo107k@gmail.com`, acha o convite da Meta e aceita. **Manda ele olhar o spam** — cai lá com frequência.

**E-mail não aparece?** Plano B, que funciona sempre: com ele logado no Facebook no celular, abrir [developers.facebook.com/requests](https://developers.facebook.com/requests). O convite pendente está ali com botão de confirmar.

✅ **Confirma quando:** você atualiza App Roles → Roles no teu notebook e o nome dele aparece **sem** a etiqueta "Pendente".

> Sem isso, o passo 5 falha com erro de permissão. É a causa nº1 de falha e não tem sintoma óbvio — o erro aponta pra permissão, não pra cargo faltando.

**Explicação pra dar a ele, se perguntar o que é isso:**
> "É uma autorização da Meta pra que o nosso sistema possa postar na sua conta. Enquanto o sistema está em fase de testes, a Meta exige que cada conta seja autorizada uma por uma. Não dá acesso a nada seu — é o contrário, é você autorizando a gente."

### Passo 4 — Abrir o painel · celular dele · 1 min

Você digita a URL do túnel no navegador do celular dele e faz login no painel. Vai em **Configurações** e aperta **Conectar Instagram**.

✅ **Confirma quando:** abre a tela azul do Facebook.

### Passo 5 — Autorizar · celular dele · 2 min

Ele digita a senha do Facebook e aceita as permissões.

> **Fale antes de ele tocar:** "aceita tudo, não desmarca nada". Se desmarcar uma permissão, quebra no passo 6 — e o erro aparece longe da causa, o que torna o diagnóstico bem mais difícil na hora.

✅ **Confirma quando:** volta pro painel mostrando **Página conectada** com o nome da ótica. Se aparecer lista de Páginas, escolhe a da ótica.

### Passo 6 — Publicar o teste · celular dele · 2 min

Aperta **Testar Publicação**. Abre o Instagram da ótica junto com ele e mostra o post aparecendo.

✅ **Este é o momento da reunião.** É a prova concreta de que funciona.

### Passo 7 — Limpar · 1 min

Apaga o post de teste juntos. Explica que os posts de verdade vêm com a identidade visual da ótica e passam pela aprovação dele antes de ir ao ar.

---

## Quando der errado

O painel já mostra o erro traduzido (`explain_ig_error` em [`instagram_preflight.py`](../backend/app/services/instagram_preflight.py)). Esta tabela é o backup em papel.

| Sintoma | Causa | O que fazer |
|---|---|---|
| Nenhuma Página aparece pra escolher | Passo 1 ou 2 não concluiu de verdade | Voltar e refazer. Erro mais comum |
| "Permissões insuficientes" / código 200 | Convite não aceito, ou permissão recusada no login | Refazer passos 3 e 5 |
| Código 190 | Token expirado ou revogado | Reconectar. Nada se perde |
| Código 368 | **Conta bloqueada por política** | **Parar. Não tentar de novo** — insistir agrava. Anotar o `fbtrace_id`, abrir recurso em facebook.com/support, remarcar |
| Código 4, 17, 32 ou 613 | Cota estourada | Esperar virar a hora. Não insistir |
| Conecta, mas o teste falha | Túnel caiu, ou `API_BASE_URL` errada | Conferir o túnel. Rodar o preflight |
| Página não abre no celular dele | Túnel caiu, ou ele está no wifi da loja com bloqueio | Passar pro 4G, ou compartilhar internet do teu celular |

**Frase pronta pra travar sem perder a cara:**

> "Achei o ponto. É uma configuração do lado da Meta que eu resolvo daqui. Te aviso quando estiver liberado e a gente fecha em 10 minutos."

Isso é verdade em praticamente todos os casos da tabela — e é muito melhor que ficar mexendo em silêncio.

---

## Depois

- [ ] Conferir `GET /auth/facebook/status` → `connected: true` e a data de expiração
- [ ] Anotar o vencimento do token (60 dias) e agendar a renovação
- [ ] Atualizar o [`PLANO.md`](../PLANO.md): IG-setup deixa de bloquear, libera a Fase 10a-ig
- [ ] **Falar do VPS.** Com túnel, a publicação automática só funciona enquanto teu notebook estiver ligado — não serve pra operação diária. Essa conversa é infinitamente melhor logo depois de ele ter visto o post publicar na frente dele
