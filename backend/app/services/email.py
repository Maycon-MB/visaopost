"""Envio de email via Resend + render de templates Jinja2.

Protocol `EmailClient` pra testes injetarem fake sem mockar SDK global.
Resend tier free: 3.000 emails/mês + 100/dia (suficiente pra MVP).

Sandbox mode (sem domínio verificado): só manda pra `RESEND_FROM_EMAIL`
ou pro email cadastrado da conta. Em produção, verificar domínio em
resend.com/domains pra liberar destinatário arbitrário.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Protocol

import resend
from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)

_TEMPLATES_DIR = Path(__file__).resolve().parents[1] / "templates" / "email"


class EmailClient(Protocol):
    """Interface mínima — testes injetam fake sem tocar rede."""

    def send(self, *, to: str, subject: str, html: str) -> str:
        """Envia email. Retorna message id do provedor."""
        ...


class _ResendClient:
    """Cliente real Resend. Configura SDK no construtor."""

    def __init__(self, api_key: str, from_email: str) -> None:
        if not api_key:
            raise RuntimeError("RESEND_API_KEY ausente no .env")
        if not from_email:
            raise RuntimeError("RESEND_FROM_EMAIL ausente no .env")
        resend.api_key = api_key
        self._from = from_email

    def send(self, *, to: str, subject: str, html: str) -> str:
        resp = resend.Emails.send(
            {
                "from": self._from,
                "to": [to],
                "subject": subject,
                "html": html,
            }
        )
        msg_id = str(resp.get("id", ""))
        logger.info("email.sent", to=to, subject=subject, message_id=msg_id)
        return msg_id


_env: Environment | None = None


def _get_env() -> Environment:
    global _env
    if _env is None:
        _env = Environment(
            loader=FileSystemLoader(_TEMPLATES_DIR),
            autoescape=select_autoescape(["html", "xml"]),
            keep_trailing_newline=False,
        )
    return _env


def render_template(name: str, **context: Any) -> str:
    """Carrega `app/templates/email/<name>` e renderiza com o contexto."""
    template = _get_env().get_template(name)
    return template.render(**context)


def send_approval_email(
    *,
    to: str,
    approval_url: str,
    image_url: str,
    business_name: str,
    theme: str,
    caption_preview: str,
    cta: str,
    scheduled_date: str,
    client: EmailClient | None = None,
) -> str:
    """Manda o email de aprovação. URL pública + preview do post."""
    settings = get_settings()
    actual_client = client or _ResendClient(settings.resend_api_key, settings.resend_from_email)
    html = render_template(
        "approval_email.html",
        approval_url=approval_url,
        image_url=image_url,
        business_name=business_name,
        theme=theme.replace("_", " "),
        caption_preview=caption_preview,
        cta=cta,
        scheduled_date=scheduled_date,
    )
    subject = f"[{business_name}] Post de {scheduled_date} aguarda sua aprovação"
    return actual_client.send(to=to, subject=subject, html=html)


def send_password_reset_email(
    *,
    to: str,
    reset_url: str,
    name: str,
    business_name: str,
    expires_minutes: int,
    client: EmailClient | None = None,
) -> str:
    """Manda o link de redefinição de senha do painel."""
    settings = get_settings()
    actual_client = client or _ResendClient(settings.resend_api_key, settings.resend_from_email)
    html = f"""\
<!doctype html><html><body style="margin:0;background:#f6f7f3;font-family:Arial,Helvetica,sans-serif;color:#16201a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border:1px solid #e3e8df;border-radius:14px;overflow:hidden">
        <tr><td style="background:#0d3322;padding:22px 28px;color:#fff;font-size:18px;font-weight:bold">{business_name}</td></tr>
        <tr><td style="padding:28px">
          <p style="margin:0 0 14px;font-size:16px">Olá, {name}.</p>
          <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#4d564e">
            Recebemos um pedido pra redefinir a senha do seu painel. Clique no botão abaixo.
            O link vale por {expires_minutes} minutos.
          </p>
          <p style="margin:0 0 24px"><a href="{reset_url}" style="background:#1a5c3d;color:#fff;text-decoration:none;padding:14px 26px;border-radius:999px;font-size:15px;font-weight:bold;display:inline-block">Criar nova senha</a></p>
          <p style="margin:0;font-size:12.5px;color:#818a80;line-height:1.6">
            Se não foi você, pode ignorar este email — sua senha continua a mesma.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""
    subject = f"[{business_name}] Redefinir sua senha"
    return actual_client.send(to=to, subject=subject, html=html)
