"""Testa services/email: Jinja2 render + fluxo send_approval_email com fake.

Sem rede. EmailClient fake captura calls. Template real é renderizado.
"""

from __future__ import annotations

from app.services.email import EmailClient, render_template, send_approval_email


class _FakeMailer:
    def __init__(self) -> None:
        self.calls: list[dict[str, str]] = []

    def send(self, *, to: str, subject: str, html: str) -> str:
        self.calls.append({"to": to, "subject": subject, "html": html})
        return f"fake-id-{len(self.calls)}"


def test_render_template_inclui_variaveis_essenciais() -> None:
    html = render_template(
        "approval_email.html",
        approval_url="https://example.com/aprovar/TOKEN",
        image_url="https://example.com/post.jpg",
        business_name="Ótica Di Lorenzo",
        theme="natal",
        caption_preview="Caption curtinha.",
        cta="Agende seu exame",
        scheduled_date="2026-06-01",
    )
    assert "Ótica Di Lorenzo" in html
    assert "natal" in html
    assert "https://example.com/aprovar/TOKEN" in html
    assert "Agende seu exame" in html
    assert "Caption curtinha." in html
    assert 'src="https://example.com/post.jpg"' in html


def test_render_template_escapa_html_perigoso() -> None:
    """Caption do Gemini com `<script>` não pode injetar JS no email."""
    html = render_template(
        "approval_email.html",
        approval_url="https://x",
        image_url="https://x",
        business_name="Loja",
        theme="generic",
        caption_preview="<script>alert(1)</script>",
        cta="X",
        scheduled_date="2026-06-01",
    )
    assert "<script>alert(1)</script>" not in html
    assert "&lt;script&gt;" in html


def test_send_approval_email_usa_client_injetado() -> None:
    mailer = _FakeMailer()
    msg_id = send_approval_email(
        to="dono@otica.com",
        approval_url="https://x/aprovar/T",
        image_url="https://x/post.jpg",
        business_name="Loja",
        theme="natal",
        caption_preview="X",
        cta="Y",
        scheduled_date="2026-06-01",
        client=mailer,
    )
    assert msg_id == "fake-id-1"
    assert len(mailer.calls) == 1
    call = mailer.calls[0]
    assert call["to"] == "dono@otica.com"
    assert "Loja" in call["subject"]
    assert "2026-06-01" in call["subject"]
    assert "Loja" in call["html"]
    assert "https://x/aprovar/T" in call["html"]


def test_email_client_protocol_compliance() -> None:
    """Sanity check — fake satisfaz Protocol em runtime."""
    fake: EmailClient = _FakeMailer()
    assert hasattr(fake, "send")
