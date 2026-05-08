# VisaoPost

> Plataforma SaaS de automação de marketing digital para óticas — posts inteligentes com IA, landing page, bot WhatsApp e sistema de recall.

🔗 **Produção:** [maycon-mb.github.io/visaopost](https://maycon-mb.github.io/visaopost/)

## O que faz

- **Posts automáticos no Instagram** com identidade visual personalizada (composição de camadas via Pillow)
- **Legendas geradas por IA** (Gemini 2.0 Flash) com contexto sazonal e climático
- **Aprovação em 10 segundos** — cliente recebe preview por e-mail e toca Aprovar/Reprovar
- **Publicação automática** via Instagram Graph API no horário ideal
- **Landing Page Premium** inclusa (SEO, Google Meu Negócio)
- **Bot WhatsApp 24h** para FAQ e atendimento automatizado
- **Sistema de Recall** — avisa clientes 1 ano após a compra para renovar o exame
- **Calendário estratégico** de datas comemorativas brasileiras integrado

## Piloto

Ótica Di Lorenzo — primeiro cliente em fase de validação.

## Stack

### Backend (API)
- **Runtime:** Python 3.13 + FastAPI
- **Imagens:** Pillow (composição de camadas)
- **IA:** Google Gemini 2.0 Flash (free tier)
- **DB:** Supabase (PostgreSQL, SQL puro — sem ORM)
- **Email:** Resend
- **Deploy:** Docker + Railway

### Frontend (Site)
- **Framework:** React 18 + Vite
- **Animações:** Framer Motion
- **Ícones:** Lucide React
- **Fontes:** Inter, Playfair Display, Montserrat
- **Deploy:** GitHub Pages (CI/CD via GitHub Actions)

## Estrutura do Projeto

```
src/
├── components/
│   ├── PresentationPage.jsx   # Página de apresentação SaaS (pitch + planos)
│   ├── LandingPage.jsx        # Landing page da ótica cliente
│   └── App.jsx                # Router entre Landing e Presentation
├── data/
│   └── content.js             # Dados centralizados (planos, estratégias, depoimentos)
├── styles/
│   └── theme.js               # Design tokens (cores, fontes, bordas)
├── index.css                  # Estilos globais e responsividade
└── main.jsx                   # Entry point

apresentacao.html              # Pitch original (HTML estático, 358KB)
landing_dilorenzo.html         # Landing da Di Lorenzo (HTML estático)
demo/                          # Protótipo de geração de post + envio de e-mail
.github/workflows/deploy.yml   # CI/CD para GitHub Pages
```

## Planos

| Plano | Preço | Setup | Foco |
|---|---|---|---|
| **Presença Digital** | R$97/mês | R$800 | Atração — Instagram profissional ativo |
| **Vendas Ativas** | R$197/mês | R$1.000 | Conversão — Landing Page + Google SEO |
| **Piloto Automático** | R$297/mês | R$1.500 | Ciclo completo — WhatsApp Bot + Recall |

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em dev
npm run dev

# Build para produção
npm run build
```

## Demo (Backend)

```bash
cd demo
pip install Pillow
python send_demo.py
```

---

Desenvolvido por **Maycon Bruno**
