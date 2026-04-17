"""
Demo completo: gera post e envia e-mail de aprovacao via Gmail.
Aprovacao/Rejeicao acontece via resposta de e-mail (sem servidor necessario).
Uso: python send_demo.py
"""
import os
import smtplib
import sys
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

# ── Carrega .env ──────────────────────────────────────────────────────────
def _load_env():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

_load_env()

GMAIL_USER     = os.environ["GMAIL_USER"]
GMAIL_PASSWORD = os.environ["GMAIL_APP_PASSWORD"].replace(" ", "")
DEST_EMAIL     = os.environ["DEST_EMAIL"]

DEMO_DIR = Path(__file__).parent
sys.path.insert(0, str(DEMO_DIR))

from generate_post import generate, BRAND, CAPTION, HASHTAGS

# ── Acoes de aprovacao via mailto (sem servidor, funciona de qualquer rede)
APPROVE_MAILTO = (
    f"mailto:{GMAIL_USER}"
    f"?subject=%E2%9C%85%20APROVADO%20-%20{BRAND['name'].replace(' ', '%20')}%20-%20Hoje%2018h"
    f"&body=Post%20aprovado%20para%20publicacao."
)
REJECT_MAILTO = (
    f"mailto:{GMAIL_USER}"
    f"?subject=%E2%9D%8C%20REPROVADO%20-%20{BRAND['name'].replace(' ', '%20')}%20-%20Hoje%2018h"
    f"&body=Post%20reprovado.%20Favor%20gerar%20nova%20opcao."
)


def build_email(img_path: Path) -> str:
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#EBF2FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#EBF2FB;">
<tr><td align="center" style="padding:24px 12px 40px;">

  <table width="100%" cellpadding="0" cellspacing="0"
         style="max-width:500px;background:#ffffff;border-radius:20px;overflow:hidden;
                box-shadow:0 4px 28px rgba(0,0,0,0.10);">

    <!-- HEADER -->
    <tr>
      <td style="background:#0A2D5A;padding:22px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p style="margin:0;color:#00A8CC;font-size:10px;text-transform:uppercase;
                         letter-spacing:2px;font-weight:600;">Aprovacao de Conteudo</p>
              <p style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;
                         letter-spacing:-0.3px;">{BRAND['name']}</p>
            </td>
            <td align="right" style="vertical-align:top;">
              <span style="display:inline-block;background:#FF8C00;color:#fff;
                            font-size:11px;font-weight:700;padding:5px 14px;
                            border-radius:20px;letter-spacing:0.5px;">
                Aguardando
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- IMAGEM DO POST -->
    <tr>
      <td style="padding:0;line-height:0;">
        <img src="cid:post_image"
             alt="Preview do post gerado"
             width="500"
             style="width:100%;max-width:500px;display:block;">
      </td>
    </tr>

    <!-- AGENDAMENTO -->
    <tr>
      <td style="padding:20px 24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#EBF5FB;border-radius:12px;border-left:4px solid #00A8CC;">
          <tr>
            <td style="padding:14px 18px;">
              <p style="margin:0;font-size:10px;color:#5B8FA8;text-transform:uppercase;
                         letter-spacing:1.5px;font-weight:600;">Agendado para publicacao</p>
              <p style="margin:5px 0 0;font-size:17px;font-weight:700;color:#0A2D5A;">
                Hoje, 17 de abril &nbsp;&bull;&nbsp; 18h00 &nbsp;&bull;&nbsp; Instagram
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- LEGENDA GERADA -->
    <tr>
      <td style="padding:20px 24px 0;">
        <p style="margin:0 0 8px;font-size:10px;color:#5B8FA8;text-transform:uppercase;
                   letter-spacing:1.5px;font-weight:600;">Legenda gerada pela IA</p>
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#F8FAFC;border-radius:12px;border:1px solid #E2EBF4;">
          <tr>
            <td style="padding:16px 18px;">
              <p style="margin:0;font-size:14px;color:#1A2E4A;line-height:1.75;">
                {CAPTION}
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#00A8CC;line-height:1.9;">
                {HASHTAGS}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- INSTRUCAO -->
    <tr>
      <td style="padding:18px 24px 0;">
        <p style="margin:0;font-size:13px;color:#5B8FA8;text-align:center;line-height:1.5;">
          Revise o post acima e toque em <strong style="color:#0A2D5A;">Aprovar</strong>
          para confirmar a publicacao ou <strong style="color:#0A2D5A;">Reprovar</strong>
          para gerar uma nova opcao.
        </p>
      </td>
    </tr>

    <!-- BOTOES -->
    <tr>
      <td style="padding:20px 24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <!-- Reprovar -->
            <td width="46%" align="center">
              <a href="{REJECT_MAILTO}"
                 style="display:block;padding:15px 10px;background:#F0F4F8;
                         border:1.5px solid #D0DCE8;border-radius:14px;
                         text-decoration:none;color:#5B8FA8;font-size:15px;
                         font-weight:600;text-align:center;">
                &#10005; &nbsp;Reprovar
              </a>
            </td>
            <td width="8%"></td>
            <!-- Aprovar -->
            <td width="46%" align="center">
              <a href="{APPROVE_MAILTO}"
                 style="display:block;padding:15px 10px;
                         background:#00C853;
                         border-radius:14px;text-decoration:none;
                         color:#ffffff;font-size:15px;font-weight:700;
                         text-align:center;
                         box-shadow:0 4px 14px rgba(0,200,83,0.35);">
                &#10003; &nbsp;Aprovar
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#F0F4F8;padding:16px 24px;border-top:1px solid #E2EBF4;">
        <p style="margin:0;font-size:11px;color:#AAB8C2;text-align:center;line-height:1.6;">
          Gerado automaticamente por <strong style="color:#5B8FA8;">VisaoPost</strong>
          &nbsp;&bull;&nbsp; Este e-mail expira em 2 horas
          <br>Voce esta recebendo porque sua conta esta ativa no sistema.
        </p>
      </td>
    </tr>

  </table>
</td></tr>
</table>

</body>
</html>"""


def send(html: str, img_path: Path):
    # multipart/mixed
    #   multipart/related
    #     text/html  (referencia cid:post_image)
    #     image/jpeg (Content-ID: post_image)
    outer = MIMEMultipart("mixed")
    outer["Subject"] = f"[Aprovar Agora] Novo post pronto - {BRAND['name']} - Hoje 18h"
    outer["From"]    = f"VisaoPost <{GMAIL_USER}>"
    outer["To"]      = DEST_EMAIL

    related = MIMEMultipart("related")

    related.attach(MIMEText(html, "html", "utf-8"))

    with open(img_path, "rb") as f:
        img = MIMEImage(f.read(), "jpeg")
    img.add_header("Content-ID", "<post_image>")
    img.add_header("Content-Disposition", "inline", filename="post.jpg")
    related.attach(img)

    outer.attach(related)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
        s.login(GMAIL_USER, GMAIL_PASSWORD)
        s.sendmail(GMAIL_USER, DEST_EMAIL, outer.as_bytes())

    print(f"[OK] E-mail enviado para {DEST_EMAIL}")


if __name__ == "__main__":
    print("Gerando post...")
    img_path, _ = generate()

    print("Montando e-mail...")
    html = build_email(img_path)

    print("Enviando via Gmail SMTP...")
    send(html, img_path)

    print()
    print("=" * 50)
    print("  Demo enviado com sucesso!")
    print(f"  Verifique: {DEST_EMAIL}")
    print()
    print("  Fluxo do demo:")
    print("  1. Abra o e-mail no celular")
    print("  2. Veja o post + legenda")
    print("  3. Toque em 'Aprovar'")
    print("     -> Abre e-mail pre-preenchido de confirmacao")
    print("  (No produto final: link para pagina web)")
    print("=" * 50)
