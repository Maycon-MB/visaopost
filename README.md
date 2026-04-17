# VisaoPost

Plataforma de automação de conteúdo para Instagram voltada a pequenos negócios.

## O que faz

- Gera posts com identidade visual da marca usando composição de camadas (Pillow)
- Cria legendas via IA (Gemini)
- Envia e-mail de aprovação ao cliente antes de publicar
- Posta automaticamente via Instagram Graph API
- Calendário de datas comemorativas brasileiras integrado

## Stack

- **Backend:** Python 3.13 + FastAPI
- **Imagens:** Pillow (composição de camadas)
- **IA:** Gemini 2.0 Flash (free tier)
- **DB:** Supabase (PostgreSQL)
- **Email:** Resend
- **Deploy:** Docker + Railway

## Estrutura

```
demo/          # Protótipo funcional de geração de post + envio de e-mail
apresentacao.html  # Pitch do produto
ideia.md       # Conceito original
```

## Demo

```bash
cd demo
pip install Pillow
python send_demo.py
```

---

Desenvolvido por Maycon Bruno
