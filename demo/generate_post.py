"""
Demo: gerador de post para ótica
Gera post.jpg + approval.html com imagem embutida.
"""
import base64
import os
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ── Configuração da marca ──────────────────────────────────────────────────
BRAND = {
    "name": "Ótica Visão+",
    "tagline": "Enxergar bem é viver melhor",
    "primary":   (10,  45,  90),   # azul escuro
    "secondary": (0,  168, 204),   # azul claro/turquesa
    "white":     (255, 255, 255),
    "light":     (230, 240, 250),
}

CAPTION = (
    "Você sabia que 80% das informações que recebemos vêm pelos olhos? "
    "Cuide da sua visão! 👓✨ Venha fazer seu exame gratuito esta semana."
)

HASHTAGS = (
    "#otica #saúdeocular #óculos #visão #cuidadoscomavista "
    "#oculosdearmação #examedavista #oticavisaomais"
)

POST_TEXT = "Você enxerga\nbem o mundo\nao seu redor?"
SUB_TEXT  = "Exame gratuito esta semana!"

SIZE = (1080, 1080)


def _font(size: int):
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _draw_rounded_rect(draw: ImageDraw.Draw, xy, radius: int, fill):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill)


def generate() -> tuple[Path, str]:
    img = Image.new("RGB", SIZE, color=BRAND["primary"])
    draw = ImageDraw.Draw(img)

    # ── Fundo: gradiente simulado com faixas ───────────────────────────────
    for y in range(SIZE[1]):
        ratio = y / SIZE[1]
        r = int(BRAND["primary"][0] * (1 - ratio) + BRAND["secondary"][0] * ratio * 0.4)
        g = int(BRAND["primary"][1] * (1 - ratio) + BRAND["secondary"][1] * ratio * 0.4)
        b = int(BRAND["primary"][2] * (1 - ratio) + BRAND["secondary"][2] * ratio * 0.5)
        draw.line([(0, y), (SIZE[0], y)], fill=(r, g, b))

    # ── Círculo decorativo ─────────────────────────────────────────────────
    draw.ellipse([600, -150, 1250, 500], fill=(*BRAND["secondary"], 30) if False else (15, 75, 130))
    draw.ellipse([650, -100, 1200, 450], fill=(12, 60, 110))

    # ── Ícone de óculos (vetorial simples) ────────────────────────────────
    cx, cy = 540, 290
    lw = 12
    # lente esquerda
    draw.ellipse([cx-220, cy-90, cx-40, cy+90],  outline=BRAND["secondary"], width=lw)
    # lente direita
    draw.ellipse([cx+40,  cy-90, cx+220, cy+90], outline=BRAND["secondary"], width=lw)
    # ponte
    draw.line([cx-40, cy, cx+40, cy], fill=BRAND["secondary"], width=lw)
    # hastes
    draw.line([cx-220, cy, cx-300, cy-40], fill=BRAND["secondary"], width=lw)
    draw.line([cx+220, cy, cx+300, cy-40], fill=BRAND["secondary"], width=lw)

    # ── Texto principal ───────────────────────────────────────────────────
    font_big  = _font(92)
    font_med  = _font(44)
    font_small= _font(34)
    font_tiny = _font(28)

    lines = POST_TEXT.split("\n")
    y_start = 430
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font_big)
        w = bbox[2] - bbox[0]
        x = (SIZE[0] - w) // 2
        # sombra
        draw.text((x+3, y_start+3), line, font=font_big, fill=(0, 0, 0, 120))
        draw.text((x, y_start), line, font=font_big, fill=BRAND["white"])
        y_start += 100

    # ── Subtítulo ─────────────────────────────────────────────────────────
    y_start += 20
    bbox = draw.textbbox((0, 0), SUB_TEXT, font=font_med)
    w = bbox[2] - bbox[0]
    x = (SIZE[0] - w) // 2
    _draw_rounded_rect(draw, [x-20, y_start-10, x+w+20, y_start+54], 30, BRAND["secondary"])
    draw.text((x, y_start), SUB_TEXT, font=font_med, fill=BRAND["white"])

    # ── Rodapé com nome da marca ──────────────────────────────────────────
    draw.rectangle([0, 960, SIZE[0], SIZE[1]], fill=(5, 25, 55))
    brand_txt = BRAND["name"]
    bbox = draw.textbbox((0, 0), brand_txt, font=font_small)
    w = bbox[2] - bbox[0]
    draw.text(((SIZE[0]-w)//2, 985), brand_txt, font=font_small, fill=BRAND["secondary"])

    tagline = BRAND["tagline"]
    bbox = draw.textbbox((0, 0), tagline, font=font_tiny)
    w = bbox[2] - bbox[0]
    draw.text(((SIZE[0]-w)//2, 1030), tagline, font=font_tiny, fill=(180, 200, 220))

    # ── Salvar imagem ─────────────────────────────────────────────────────
    out_path = Path(__file__).parent / "post.jpg"
    img.save(out_path, "JPEG", quality=92)
    print(f"[OK] Imagem gerada: {out_path}")

    # ── Embutir em base64 para o HTML ─────────────────────────────────────
    with open(out_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()

    return out_path, b64


def build_html(b64_image: str) -> Path:
    html_path = Path(__file__).parent / "approval.html"
    scheduled = "Hoje às 18h00"

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>Aprovação de Post — {BRAND['name']}</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0A2D5A;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 40px;
  }}
  .header {{
    width: 100%;
    background: #051929;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 2px solid #00A8CC;
  }}
  .header-dot {{
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #00A8CC;
    animation: pulse 1.5s infinite;
  }}
  @keyframes pulse {{
    0%, 100% {{ opacity: 1; }}
    50% {{ opacity: 0.3; }}
  }}
  .header h1 {{
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }}
  .header span {{
    color: #00A8CC;
    font-size: 13px;
    margin-left: auto;
  }}
  .card {{
    width: 100%;
    max-width: 480px;
    background: #0D3568;
    border-radius: 0 0 20px 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }}
  .post-image {{
    width: 100%;
    display: block;
    aspect-ratio: 1/1;
    object-fit: cover;
  }}
  .caption-box {{
    padding: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }}
  .caption-label {{
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #00A8CC;
    margin-bottom: 8px;
  }}
  .caption-text {{
    color: #E0EAF5;
    font-size: 14px;
    line-height: 1.6;
  }}
  .hashtags {{
    margin-top: 10px;
    color: #00A8CC;
    font-size: 12px;
    line-height: 1.7;
  }}
  .schedule-box {{
    margin: 0 20px 4px;
    padding: 12px 16px;
    background: rgba(0,168,204,0.12);
    border-radius: 10px;
    border-left: 3px solid #00A8CC;
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .schedule-box .icon {{ font-size: 18px; }}
  .schedule-box .info {{ flex: 1; }}
  .schedule-box .info .label {{
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #7BBDD4;
  }}
  .schedule-box .info .time {{
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  }}
  .actions {{
    padding: 20px;
    display: flex;
    gap: 12px;
  }}
  .btn {{
    flex: 1;
    padding: 16px;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }}
  .btn:active {{ transform: scale(0.97); opacity: 0.85; }}
  .btn-approve {{
    background: linear-gradient(135deg, #00C853, #00A040);
    color: white;
    box-shadow: 0 4px 15px rgba(0,200,83,0.35);
  }}
  .btn-reject {{
    background: rgba(255,255,255,0.08);
    color: #E0EAF5;
    border: 1px solid rgba(255,255,255,0.15);
  }}
  .feedback {{
    display: none;
    text-align: center;
    padding: 30px 20px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    animation: fadeIn 0.4s ease;
  }}
  @keyframes fadeIn {{
    from {{ opacity: 0; transform: translateY(10px); }}
    to   {{ opacity: 1; transform: translateY(0); }}
  }}
  .footer-note {{
    margin-top: 20px;
    color: rgba(255,255,255,0.35);
    font-size: 11px;
    text-align: center;
    padding: 0 20px;
  }}
</style>
</head>
<body>

<div class="header">
  <div class="header-dot"></div>
  <h1>Aprovação de Post</h1>
  <span>{BRAND['name']}</span>
</div>

<div class="card">
  <img class="post-image" src="data:image/jpeg;base64,{b64_image}" alt="Preview do post">

  <div class="caption-box">
    <div class="caption-label">Legenda</div>
    <div class="caption-text">{CAPTION}</div>
    <div class="hashtags">{HASHTAGS}</div>
  </div>
</div>

<div style="width:100%;max-width:480px;margin-top:16px;">
  <div class="schedule-box">
    <div class="icon">📅</div>
    <div class="info">
      <div class="label">Agendado para</div>
      <div class="time">{scheduled}</div>
    </div>
  </div>

  <div class="actions" id="actions">
    <button class="btn btn-reject" onclick="reject()">✕ Reprovar</button>
    <button class="btn btn-approve" onclick="approve()">✓ Aprovar</button>
  </div>

  <div class="feedback" id="feedback-approve">
    ✅ Post aprovado!<br>
    <span style="font-size:14px;font-weight:400;color:#B0D0E8;">Será publicado {scheduled}.</span>
  </div>
  <div class="feedback" id="feedback-reject">
    🔄 Post reprovado.<br>
    <span style="font-size:14px;font-weight:400;color:#B0D0E8;">Gerando nova opção em instantes…</span>
  </div>
</div>

<p class="footer-note">Este link expira em 2 horas · Sistema automatizado por VisãoPost</p>

<script>
  function approve() {{
    document.getElementById('actions').style.display = 'none';
    document.getElementById('feedback-approve').style.display = 'block';
  }}
  function reject() {{
    document.getElementById('actions').style.display = 'none';
    document.getElementById('feedback-reject').style.display = 'block';
  }}
</script>

</body>
</html>"""

    html_path.write_text(html, encoding="utf-8")
    print(f"[OK] Pagina gerada: {html_path}")
    return html_path


if __name__ == "__main__":
    print("Gerando demo de post para otica...")
    _, b64 = generate()
    build_html(b64)
    print("\nProximo passo: python serve.py")
