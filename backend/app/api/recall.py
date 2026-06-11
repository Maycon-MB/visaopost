"""Fase 7c — QR Code de balcão + form opt-in recall.

Rotas públicas (sem auth):
  GET  /recall/qr/{tenant_slug}        → form opt-in (mobile-first HTML)
  POST /recall/qr/{tenant_slug}        → processa form, cria client, devolve página de sucesso/erro
  GET  /recall/qr/{tenant_slug}/print  → página A6 imprimível com QR code (para o dono)
"""

from __future__ import annotations

import io

import qrcode
import qrcode.image.svg
from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import HTMLResponse

from app.db.repositories.clients import ClientPhoneConflict, create_client
from app.db.repositories.tenants import get_tenant_id_by_slug
from app.logging import get_logger
from app.models.client import ClientCreate

router = APIRouter(tags=["recall"])
logger = get_logger(__name__)

# ─── Paleta Di Lorenzo ────────────────────────────────────────────────────────
_OCHRE = "#C1750B"
_BLACK = "#03191E"
_OFF_WHITE = "#F6F8FF"
_FONT = "'Corbel', 'Gill Sans', system-ui, sans-serif"

# ─── QR helper ───────────────────────────────────────────────────────────────

def _make_qr_svg(url: str) -> str:
    factory = qrcode.image.svg.SvgImage
    img = qrcode.make(url, image_factory=factory, box_size=10, border=2)
    buf = io.BytesIO()
    img.save(buf)
    svg = buf.getvalue().decode("utf-8")
    # Remove XML declaration — embed direto no HTML
    if svg.startswith("<?xml"):
        svg = svg[svg.index("<svg"):]
    return svg


def _recall_url(tenant_slug: str, base_url: str) -> str:
    return f"{base_url}/recall/qr/{tenant_slug}"


# ─── HTML helpers ─────────────────────────────────────────────────────────────

def _page_shell(title: str, body: str, extra_css: str = "") -> str:
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="robots" content="noindex"/>
  <title>{title}</title>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{
      --ochre: {_OCHRE};
      --black: {_BLACK};
      --off-white: {_OFF_WHITE};
      --font: {_FONT};
    }}
    html {{ font-size: 16px; }}
    body {{ font-family: var(--font); background: #faf8f4; color: var(--black); }}
    {extra_css}
  </style>
</head>
<body>{body}</body>
</html>"""


_FORM_CSS = """
  body { min-height: 100dvh; display: flex; flex-direction: column; }

  .wrap {
    flex: 1;
    max-width: 440px;
    width: 100%;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2.25rem;
  }

  .brand-seal {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1.5px solid var(--ochre);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
    color: var(--ochre); background: var(--black); flex-shrink: 0;
  }

  .brand-name {
    font-size: 17px; font-weight: 300; color: var(--black); letter-spacing: 0.04em;
  }
  .brand-name em { font-style: italic; color: var(--ochre); font-weight: 300; }

  .hero-title {
    font-size: clamp(1.6rem, 6vw, 2.2rem);
    font-weight: 300;
    line-height: 1.15;
    color: var(--black);
    margin-bottom: 0.6rem;
  }

  .hero-title strong { font-weight: 600; color: var(--ochre); }

  .hero-sub {
    font-size: 14px; font-weight: 300;
    color: rgba(3,25,30,0.6); line-height: 1.55;
    margin-bottom: 2rem;
  }

  .divider {
    width: 40px; height: 2px;
    background: var(--ochre); opacity: 0.5;
    margin-bottom: 2rem;
  }

  .form-group { margin-bottom: 1.1rem; }

  label {
    display: block;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: rgba(3,25,30,0.55);
    margin-bottom: 0.4rem;
  }

  input[type=text], input[type=tel] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1.5px solid rgba(3,25,30,0.15);
    border-radius: 10px;
    font-size: 15px; font-family: var(--font);
    color: var(--black); background: #fff;
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }

  input[type=text]:focus, input[type=tel]:focus {
    border-color: var(--ochre);
  }

  .consent-row {
    display: flex; gap: 10px; align-items: flex-start;
    margin-top: 0.4rem;
  }

  input[type=checkbox] {
    margin-top: 3px; flex-shrink: 0;
    width: 17px; height: 17px;
    accent-color: var(--ochre);
    cursor: pointer;
  }

  .consent-text {
    font-size: 12px; line-height: 1.5;
    color: rgba(3,25,30,0.55);
  }

  .btn-submit {
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.9rem 1rem;
    background: var(--ochre);
    color: #fff;
    border: none; border-radius: 10px;
    font-size: 15px; font-weight: 500;
    font-family: var(--font);
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .btn-submit:hover { background: #a86209; }
  .btn-submit:active { transform: scale(0.98); }

  .footer-note {
    margin-top: 2rem;
    font-size: 11px; color: rgba(3,25,30,0.35);
    text-align: center; line-height: 1.6;
  }
"""

_SUCCESS_CSS = """
  body {
    min-height: 100dvh;
    display: flex; align-items: center; justify-content: center;
    background: var(--black);
  }

  .card {
    max-width: 380px; width: 90%;
    text-align: center;
    padding: 3rem 2rem;
  }

  .check-wrap {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(193,117,11,0.12);
    border: 2px solid var(--ochre);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.75rem;
  }

  .check-wrap svg { color: var(--ochre); }

  .success-title {
    font-size: 1.6rem; font-weight: 300;
    color: var(--off-white); letter-spacing: 0.02em;
    margin-bottom: 0.75rem;
  }

  .success-title em { font-style: italic; color: var(--ochre); }

  .success-sub {
    font-size: 14px; font-weight: 300;
    color: rgba(246,248,255,0.55); line-height: 1.6;
  }

  .brand-foot {
    margin-top: 2.5rem;
    font-size: 12px; letter-spacing: 0.08em;
    color: rgba(246,248,255,0.25); text-transform: uppercase;
  }
"""

_ERROR_CSS = _SUCCESS_CSS  # mesma estrutura


def _form_html(tenant_slug: str, error: str | None = None) -> str:
    error_block = ""
    if error:
        error_block = f"""
        <div style="background:rgba(148,28,47,0.09);border:1px solid rgba(148,28,47,0.3);
                    border-radius:10px;padding:0.75rem 1rem;margin-bottom:1.25rem;
                    font-size:13px;color:#941C2F;">
          {error}
        </div>"""

    body = f"""
    <div class="wrap">
      <div class="brand">
        <div class="brand-seal">DL</div>
        <span class="brand-name">di <em>Lorenzo</em></span>
      </div>

      <h1 class="hero-title">
        Cadastre-se no nosso<br><strong>programa de recall</strong>
      </h1>
      <p class="hero-sub">
        Receba lembretes personalizados sobre sua consulta, lançamentos de armações e promoções exclusivas.
      </p>
      <div class="divider"></div>

      {error_block}

      <form method="POST" action="/recall/qr/{tenant_slug}">
        <div class="form-group">
          <label for="name">Seu nome</label>
          <input id="name" name="name" type="text" placeholder="Como prefere ser chamado?" required autocomplete="given-name"/>
        </div>

        <div class="form-group">
          <label for="phone">WhatsApp (DDD + número)</label>
          <input id="phone" name="phone" type="tel" placeholder="(21) 99999-9999" required autocomplete="tel" inputmode="numeric"/>
        </div>

        <div class="form-group" style="margin-top:1.25rem">
          <div class="consent-row">
            <input id="consent" name="consent" type="checkbox" value="1" required/>
            <label for="consent" class="consent-text" style="font-size:12px;text-transform:none;letter-spacing:0;color:rgba(3,25,30,0.55)">
              Concordo em receber mensagens via WhatsApp da Ótica Di Lorenzo. Posso cancelar a qualquer momento respondendo <em>SAIR</em>.
            </label>
          </div>
        </div>

        <button type="submit" class="btn-submit">Quero me cadastrar</button>
      </form>

      <p class="footer-note">
        Seus dados são usados exclusivamente pela Ótica Di Lorenzo para contato de recall.<br>
        Nunca compartilhamos com terceiros.
      </p>
    </div>"""

    return _page_shell("Cadastro recall — Ótica Di Lorenzo", body, _FORM_CSS)


def _success_html(name: str) -> str:
    first = name.strip().split()[0].capitalize()
    body = f"""
    <div class="card">
      <div class="check-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 class="success-title"><em>{first}</em>, tudo certo!</h1>
      <p class="success-sub">
        Você está cadastrado no programa de recall da Ótica Di Lorenzo.<br>
        Em breve você receberá novidades e lembretes por WhatsApp.
      </p>
      <div class="brand-foot">Ótica Di Lorenzo</div>
    </div>"""

    return _page_shell("Cadastro confirmado — Ótica Di Lorenzo", body, _SUCCESS_CSS)


def _conflict_html(tenant_slug: str) -> str:
    return _form_html(
        tenant_slug,
        error="Este número já está cadastrado. Se precisar de ajuda, fale com a nossa equipe na loja.",
    )


def _print_html(tenant_slug: str, qr_svg: str, recall_url: str) -> str:
    css = f"""
    @page {{ size: A6 portrait; margin: 0; }}

    body {{
      width: 105mm; height: 148mm;
      margin: 0; padding: 0;
      background: {_BLACK};
      color: {_OFF_WHITE};
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 0;
    }}

    .print-wrap {{
      width: 100%; padding: 8mm 10mm;
      display: flex; flex-direction: column;
      align-items: center; gap: 0;
      text-align: center;
    }}

    .brand-line {{
      font-size: 11pt; font-weight: 300; letter-spacing: 0.12em;
      color: {_OCHRE}; text-transform: uppercase;
      margin-bottom: 5mm;
    }}

    .brand-line em {{ font-style: italic; font-weight: 300; }}

    .qr-frame {{
      background: #fff;
      padding: 5mm;
      border-radius: 4mm;
      margin-bottom: 5mm;
      display: inline-block;
    }}

    .qr-frame svg {{
      width: 55mm; height: 55mm;
      display: block;
    }}

    .cta-title {{
      font-size: 13pt; font-weight: 600;
      color: {_OFF_WHITE};
      line-height: 1.2;
      margin-bottom: 2mm;
    }}

    .cta-sub {{
      font-size: 9pt; font-weight: 300;
      color: rgba(246,248,255,0.6);
      line-height: 1.4;
      margin-bottom: 4mm;
      max-width: 75mm;
    }}

    .url-line {{
      font-size: 7.5pt; color: {_OCHRE}; opacity: 0.6;
      word-break: break-all;
    }}

    .divider-line {{
      width: 20mm; height: 0.5mm;
      background: {_OCHRE}; opacity: 0.3;
      margin: 3mm 0;
    }}

    @media screen {{
      body {{
        min-height: 100vh;
        background: {_BLACK};
      }}
      .print-btn {{
        position: fixed; bottom: 24px; right: 24px;
        padding: 12px 24px;
        background: {_OCHRE}; color: #fff;
        border: none; border-radius: 8px;
        font-size: 14px; font-family: var(--font);
        cursor: pointer; font-weight: 500;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      }}
    }}

    @media print {{
      .print-btn {{ display: none; }}
    }}
    """

    body = f"""
    <div class="print-wrap">
      <div class="brand-line">di <em>Lorenzo</em></div>

      <div class="qr-frame">
        {qr_svg}
      </div>

      <div class="cta-title">Cadastre-se no recall</div>
      <div class="cta-sub">
        Escaneie o QR code e receba lembretes de consulta e novidades no WhatsApp
      </div>

      <div class="divider-line"></div>
      <div class="url-line">{recall_url}</div>
    </div>

    <button class="print-btn" onclick="window.print()">Imprimir / Salvar PDF</button>
    """

    return _page_shell("QR Code Balcão — Ótica Di Lorenzo", body, css)


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/recall/qr/{tenant_slug}", response_class=HTMLResponse)
async def recall_form(tenant_slug: str) -> HTMLResponse:
    """Formulário opt-in — renderizado quando cliente escaneia QR do balcão."""
    tid = await get_tenant_id_by_slug(tenant_slug)
    if tid is None:
        raise HTTPException(status_code=404, detail="Tenant não encontrado")
    return HTMLResponse(_form_html(tenant_slug))


@router.post("/recall/qr/{tenant_slug}", response_class=HTMLResponse)
async def recall_submit(
    tenant_slug: str,
    name: str = Form(...),
    phone: str = Form(...),
    consent: str = Form(...),
) -> HTMLResponse:
    """Processa opt-in: valida, persiste em `clients`, devolve página de confirmação."""
    tid = await get_tenant_id_by_slug(tenant_slug)
    if tid is None:
        raise HTTPException(status_code=404, detail="Tenant não encontrado")

    if not consent:
        return HTMLResponse(
            _form_html(tenant_slug, error="Você precisa aceitar os termos para se cadastrar."),
            status_code=422,
        )

    try:
        payload = ClientCreate(
            name=name,
            phone=phone,
            consent_whatsapp=True,
            source="qr_balcao",
        )
    except Exception:
        return HTMLResponse(
            _form_html(tenant_slug, error="Verifique o número de WhatsApp e tente novamente."),
            status_code=422,
        )

    try:
        await create_client(tid, payload)
    except ClientPhoneConflict:
        return HTMLResponse(_conflict_html(tenant_slug), status_code=409)
    except Exception as exc:
        logger.error("recall.submit.error", tenant=tenant_slug, error=str(exc))
        return HTMLResponse(
            _form_html(tenant_slug, error="Algo deu errado. Tente novamente em instantes."),
            status_code=500,
        )

    logger.info("recall.client_registered", tenant=tenant_slug)
    return HTMLResponse(_success_html(name))


@router.get("/recall/qr/{tenant_slug}/print", response_class=HTMLResponse)
async def recall_print(tenant_slug: str) -> HTMLResponse:
    """Página A6 imprimível com QR code. Dono abre, clica 'Imprimir', cola no balcão."""
    from app.config import get_settings
    settings = get_settings()

    # Em dev usa localhost; em prod usa o domínio real via FRONTEND_URL
    base = settings.frontend_url.replace("/visaopost/app", "").rstrip("/")
    # API base (onde o recall está servido)
    api_base = "http://localhost:8000" if settings.app_env == "dev" else "https://api.visaopost.com.br"

    recall_url = _recall_url(tenant_slug, api_base)
    qr_svg = _make_qr_svg(recall_url)

    return HTMLResponse(_print_html(tenant_slug, qr_svg, recall_url))
