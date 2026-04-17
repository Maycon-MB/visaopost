"""
4 posts para Ótica Di Lorenzo — layouts distintos, estética profissional.
"""
import math, os, random, smtplib, sys
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SIZE  = (1080, 1080)
DARK  = (11,  31,  15)
GREEN = (13,  51,  34)
AMBER = (212, 136, 10)
GOLD  = (245, 166, 35)
WHITE = (255, 255, 255)
BRAND_NAME    = "Ótica Di Lorenzo"
BRAND_TAGLINE = "Visão com estilo e qualidade"


def _font(size):
    for p in ["C:/Windows/Fonts/arialbd.ttf","C:/Windows/Fonts/arial.ttf",
              "C:/Windows/Fonts/calibrib.ttf","C:/Windows/Fonts/segoeui.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def _font_regular(size):
    for p in ["C:/Windows/Fonts/arial.ttf","C:/Windows/Fonts/segoeui.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def _w(draw, text, font):
    b = draw.textbbox((0,0), text, font=font); return b[2]-b[0], b[3]-b[1]

def _glasses(draw, cx, cy, color, lw=14, scale=1.0):
    s = int(185 * scale)
    g = int(35  * scale)
    h = int(95  * scale)
    draw.ellipse([cx-s, cy-h, cx-g,  cy+h], outline=color, width=lw)
    draw.ellipse([cx+g, cy-h, cx+s,  cy+h], outline=color, width=lw)
    draw.line([cx-g, cy, cx+g, cy],           fill=color, width=lw)
    arm = int(85*scale)
    draw.line([cx-s, cy, cx-s-arm, cy-int(45*scale)], fill=color, width=lw)
    draw.line([cx+s, cy, cx+s+arm, cy-int(45*scale)], fill=color, width=lw)

def _footer(draw, accent=(212,136,10)):
    draw.rectangle([0, 950, SIZE[0], SIZE[1]], fill=DARK)
    fw, _ = _w(draw, BRAND_NAME, _font(32))
    draw.text(((SIZE[0]-fw)//2, 968), BRAND_NAME, font=_font(32), fill=accent)
    tw, _ = _w(draw, BRAND_TAGLINE, _font_regular(22))
    draw.text(((SIZE[0]-tw)//2, 1014), BRAND_TAGLINE, font=_font_regular(22), fill=(130,170,130))


# ── 1. DIA COMUM — Layout split: bloco âmbar à direita, texto alinhado à esquerda ──
def post_comum():
    img  = Image.new("RGB", SIZE, DARK)
    draw = ImageDraw.Draw(img)

    # fundo gradiente escuro
    for y in range(950):
        t = y/950
        r = int(DARK[0]+(GREEN[0]-DARK[0])*t)
        g = int(DARK[1]+(GREEN[1]-DARK[1])*t)
        b = int(DARK[2]+(GREEN[2]-DARK[2])*t)
        draw.line([(0,y),(SIZE[0],y)], fill=(r,g,b))

    # bloco âmbar grande à direita — ocupa ~45% da largura
    draw.rectangle([580, 0, SIZE[0], 950], fill=AMBER)

    # triângulo de transição entre verde e âmbar
    draw.polygon([(530,0),(580,0),(580,950),(480,950)], fill=(160,100,5))

    # óculos no bloco âmbar, posicionado no terço superior
    _glasses(draw, 810, 280, DARK, lw=14, scale=0.85)

    # linha decorativa horizontal no bloco âmbar
    draw.rectangle([600, 420, SIZE[0]-40, 426], fill=DARK)

    # texto pequeno acima do título (bloco esquerdo, ~1/3 superior)
    f_label = _font(26)
    draw.text((60, 120), "SAÚDE OCULAR", font=f_label, fill=AMBER)
    draw.rectangle([60, 152, 260, 156], fill=AMBER)  # underline

    # título grande alinhado à esquerda
    f_title = _font(100)
    f_mid   = _font(54)
    for i, (text, y) in enumerate([("Cuide", 180), ("da sua", 290), ("visão.", 400)]):
        draw.text((60, y), text, font=f_title, fill=WHITE)

    # subtítulo alinhado à esquerda
    draw.text((60, 540), "Exame de vista gratuito.", font=_font(38), fill=(180,220,180))
    draw.text((60, 592), "Agende hoje mesmo.", font=_font_regular(34), fill=(130,170,130))

    # tag no bloco âmbar
    draw.text((610, 460), "FAÇA SEU", font=_font(28), fill=DARK)
    draw.text((610, 500), "EXAME", font=_font(52), fill=DARK)
    draw.text((610, 565), "GRATUITO", font=_font(40), fill=DARK)
    draw.text((610, 620), "esta semana", font=_font_regular(28), fill=(60,30,0))

    # linha vertical separadora sutil
    draw.rectangle([55, 120, 59, 650], fill=AMBER)

    _footer(draw, AMBER)
    out = Path(__file__).parent / "post_comum.jpg"
    img.save(out, "JPEG", quality=92)
    print("[OK] Dia Comum"); return out


# ── 2. CARNAVAL — Tipografia como elemento visual, fundo textural ──
def post_carnaval():
    img  = Image.new("RGB", SIZE, (8, 22, 10))
    draw = ImageDraw.Draw(img)

    # fundo com confetes refinados (menores, mais espalhados)
    rng = random.Random(42)
    paleta = [(245,166,35),(210,40,70),(40,170,210),(160,40,190),(255,210,0),(0,180,100)]
    for _ in range(300):
        x,y = rng.randint(0,SIZE[0]), rng.randint(0,SIZE[1])
        w,h = rng.randint(3,10), rng.randint(8,20)
        ang = rng.randint(0,180)
        cor = rng.choice(paleta)
        # retângulo rotacionado (confete)
        cx,cy = x,y
        cos_a, sin_a = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        pts = [
            (cx + cos_a*(-w/2) - sin_a*(-h/2), cy + sin_a*(-w/2) + cos_a*(-h/2)),
            (cx + cos_a*(w/2)  - sin_a*(-h/2), cy + sin_a*(w/2)  + cos_a*(-h/2)),
            (cx + cos_a*(w/2)  - sin_a*(h/2),  cy + sin_a*(w/2)  + cos_a*(h/2)),
            (cx + cos_a*(-w/2) - sin_a*(h/2),  cy + sin_a*(-w/2) + cos_a*(h/2)),
        ]
        draw.polygon(pts, fill=cor)

    # overlay escuro para manter legibilidade
    overlay = Image.new("RGB", SIZE, (8,22,10))
    img = Image.blend(img, overlay, 0.6)
    draw = ImageDraw.Draw(img)

    # faixa central diagonal (identidade da marca)
    draw.polygon([(0,300),(SIZE[0],200),(SIZE[0],680),(0,780)], fill=(12,40,14))

    # óculos centralizado dentro da faixa
    _glasses(draw, 540, 490, GOLD, lw=15, scale=1.1)

    # tipografia gigante como textura no topo
    f_huge = _font(180)
    for i, (text, y, alpha_color) in enumerate([
        ("CARNA-", 30, (40,80,20)),
        ("VAL",   185, (35,70,18)),
    ]):
        w,_ = _w(draw, text, f_huge)
        draw.text(((SIZE[0]-w)//2, y), text, font=f_huge, fill=alpha_color)

    # tag ano
    draw.rounded_rectangle([380,130,700,180], radius=24, fill=(210,40,70))
    f28 = _font(28)
    w,_ = _w(draw, "CARNAVAL 2026", f28)
    draw.text(((SIZE[0]-w)//2, 138), "CARNAVAL 2026", font=f28, fill=WHITE)

    # texto principal na faixa
    f60 = _font(60)
    f36 = _font_regular(36)
    draw.text((80, 620), "Curta a folia", font=f60, fill=WHITE)
    draw.text((80, 692), "com proteção UV. 😎", font=f36, fill=(200,200,200))

    # destaque da oferta — canto inferior direito
    draw.rounded_rectangle([680,720,1040,870], radius=16, fill=(210,40,70))
    draw.text((700,732), "ÓCULOS DE SOL", font=_font(26), fill=WHITE)
    draw.text((700,768), "20% OFF", font=_font(68), fill=GOLD)

    _footer(draw, GOLD)
    out = Path(__file__).parent / "post_carnaval.jpg"
    img.save(out, "JPEG", quality=92)
    print("[OK] Carnaval"); return out


# ── 3. BLACK FRIDAY — Minimal luxury: diagonal dourada, hierarquia tipográfica forte ──
def post_blackfriday():
    BG   = (4, 6, 4)
    img  = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(img)

    # faixa diagonal dourada cruzando o canvas
    draw.polygon([(0,380),(SIZE[0],180),(SIZE[0],280),(0,480)], fill=(60,40,0))
    draw.polygon([(0,395),(SIZE[0],195),(SIZE[0],215),(0,415)], fill=GOLD)

    # texto "BLACK" muito grande — ocupa terço superior, levemente à esquerda
    f_black = _font(180)
    f_fri   = _font(100)
    draw.text((40, 40),  "BLACK",  font=f_black, fill=(22,32,22))  # sombra
    draw.text((36, 36),  "BLACK",  font=f_black, fill=WHITE)
    draw.text((40, 222), "FRIDAY", font=f_fri,   fill=(22,32,22))  # sombra
    draw.text((36, 218), "FRIDAY", font=f_fri,   fill=GOLD)

    # óculos posicionado no terço inferior-esquerdo
    _glasses(draw, 360, 700, GOLD, lw=13, scale=0.9)

    # bloco de oferta à direita, terço inferior
    draw.rounded_rectangle([600, 560, 1040, 920], radius=20, fill=(14,20,14))
    draw.rectangle([620, 580, 1020, 584], fill=GOLD)  # linha topo do bloco

    draw.text((630, 598),  "ATÉ",          font=_font(36),       fill=(180,180,180))
    draw.text((630, 642),  "40%",          font=_font(160),      fill=GOLD)
    draw.text((630, 812),  "DE DESCONTO",  font=_font(36),       fill=WHITE)
    draw.text((630, 858),  "em armações",  font=_font_regular(30), fill=(140,170,140))

    # linha decorativa vertical no bloco
    draw.rectangle([616, 580, 620, 920], fill=GOLD)

    # rodapé
    draw.rectangle([0, 950, SIZE[0], SIZE[1]], fill=BG)
    w,_ = _w(draw, BRAND_NAME, _font(32))
    draw.text(((SIZE[0]-w)//2, 968), BRAND_NAME, font=_font(32), fill=GOLD)
    w,_ = _w(draw, BRAND_TAGLINE, _font_regular(22))
    draw.text(((SIZE[0]-w)//2, 1014), BRAND_TAGLINE, font=_font_regular(22), fill=(100,140,100))

    out = Path(__file__).parent / "post_blackfriday.jpg"
    img.save(out, "JPEG", quality=92)
    print("[OK] Black Friday"); return out


# ── 4. DIA DAS MÃES — Layout centrado elegante, círculo grande como moldura ──
def post_maes():
    ROSE  = (190, 70, 100)
    BLUSH = (230, 150, 170)

    img  = Image.new("RGB", SIZE, DARK)
    draw = ImageDraw.Draw(img)

    # gradiente sutil
    for y in range(950):
        t = y/950
        r = int(DARK[0]+(25-DARK[0])*t)
        g = int(DARK[1]+(18-DARK[1])*t)
        b = int(DARK[2]+(18-DARK[2])*t)
        draw.line([(0,y),(SIZE[0],y)], fill=(r,g,b))

    # círculo grande como moldura / elemento central
    draw.ellipse([80,80,1000,1000], outline=ROSE, width=2)
    draw.ellipse([100,100,980,980], outline=(100,40,55), width=1)

    # círculo interno preenchido (área de conteúdo)
    draw.ellipse([120,120,960,960], fill=(16,40,22))

    # corações sutis na borda do círculo (decoração)
    def heart_small(cx, cy, s, color):
        draw.ellipse([cx-s, cy-s//2, cx,    cy+s//2], fill=color)
        draw.ellipse([cx,   cy-s//2, cx+s,  cy+s//2], fill=color)
        draw.polygon([(cx-s,cy+s//4),(cx+s,cy+s//4),(cx,cy+s+s//3)], fill=color)

    for ang_deg, r_pos in [(45,430),(135,430),(225,430),(315,430),
                           (0,430),(90,430),(180,430),(270,430)]:
        ang = math.radians(ang_deg)
        hx = int(540 + r_pos * math.cos(ang))
        hy = int(540 + r_pos * math.sin(ang))
        heart_small(hx, hy, 16, ROSE)

    # óculos no terço superior dentro do círculo
    _glasses(draw, 540, 300, BLUSH, lw=13, scale=0.95)

    # linha decorativa
    lw2, _ = _w(draw, "—  —  —", _font_regular(30))
    draw.text(((SIZE[0]-lw2)//2, 430), "—  —  —", font=_font_regular(30), fill=(100,60,70))

    # texto principal centralizado, espaçado
    f70 = _font(70)
    f_reg = _font_regular(34)
    for text, y in [("Para a mãe", 480), ("que merece", 562), ("ver tudo.", 644)]:
        w,_ = _w(draw, text, f70)
        draw.text(((SIZE[0]-w)//2, y), text, font=f70, fill=WHITE)

    # oferta elegante
    draw.rectangle([200, 760, 880, 762], fill=ROSE)
    w,_ = _w(draw, "Presente especial para ela", _font(38))
    draw.text(((SIZE[0]-w)//2, 778), "Presente especial para ela", font=_font(38), fill=BLUSH)
    w,_ = _w(draw, "Armações exclusivas · Agende um horário", _font_regular(26))
    draw.text(((SIZE[0]-w)//2, 828), "Armações exclusivas · Agende um horário",
              font=_font_regular(26), fill=(160,120,130))

    # tag no topo
    tag = "DIA DAS MÃES"
    f_tag = _font(28)
    w,_ = _w(draw, tag, f_tag)
    draw.rounded_rectangle([(SIZE[0]-w)//2-20, 140, (SIZE[0]+w)//2+20, 186], radius=22, fill=ROSE)
    draw.text(((SIZE[0]-w)//2, 144), tag, font=f_tag, fill=WHITE)

    _footer(draw, BLUSH)
    out = Path(__file__).parent / "post_maes.jpg"
    img.save(out, "JPEG", quality=92)
    print("[OK] Dia das Maes"); return out


def load_env():
    env_path = Path(__file__).parent / ".env"
    if not env_path.exists():
        print("[ERRO] .env nao encontrado"); sys.exit(1)
    env = {}
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k,v = line.split("=",1); env[k.strip()] = v.strip()
    return env


def send_gallery(images, env):
    outer = MIMEMultipart("mixed")
    outer["Subject"] = "VisaoPost — 4 posts para Otica Di Lorenzo"
    outer["From"]    = env["GMAIL_USER"]
    outer["To"]      = env["DEST_EMAIL"]

    related = MIMEMultipart("related")
    cards = ""
    for title, caption, hashtags, path in images:
        cid = path.stem
        cards += f"""
        <div style="margin-bottom:32px;border-radius:12px;overflow:hidden;
                    box-shadow:0 4px 20px rgba(0,0,0,0.4);max-width:480px;
                    margin-left:auto;margin-right:auto;">
          <img src="cid:{cid}" style="width:100%;display:block;" alt="{title}">
          <div style="background:#0D3322;padding:16px;">
            <p style="color:#D4880A;font-size:11px;font-weight:700;
                       text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">{title}</p>
            <p style="color:#e0e0e0;font-size:13px;line-height:1.6;margin:0 0 8px;">{caption}</p>
            <p style="color:#666;font-size:11px;margin:0;">{hashtags}</p>
          </div>
        </div>"""

    html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:linear-gradient(135deg,#0B1F0F,#1a4a2e);
                border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="color:#D4880A;font-size:11px;letter-spacing:3px;
                text-transform:uppercase;margin:0 0 8px;">automacao de instagram</p>
      <h1 style="color:#fff;font-size:24px;margin:0 0 8px;">Otica Di Lorenzo</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">
        4 exemplos de posts gerados automaticamente pelo VisaoPost
      </p>
    </div>
    {cards}
    <p style="text-align:center;color:#333;font-size:11px;padding-top:8px;">
      VisaoPost · automacao de Instagram para pequenos negocios
    </p>
  </div>
</body></html>"""

    related.attach(MIMEText(html, "html", "utf-8"))
    for title, caption, hashtags, path in images:
        with open(path, "rb") as f:
            mi = MIMEImage(f.read(), "jpeg")
        mi.add_header("Content-ID", f"<{path.stem}>")
        mi.add_header("Content-Disposition", "inline", filename=path.name)
        related.attach(mi)
    outer.attach(related)

    print(f"Enviando para {env['DEST_EMAIL']}...")
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(env["GMAIL_USER"], env["GMAIL_APP_PASSWORD"])
        smtp.sendmail(env["GMAIL_USER"], env["DEST_EMAIL"], outer.as_bytes())
    print("[OK] E-mail enviado!")


POSTS_META = [
    ("Dia Comum",
     "Seus olhos merecem atenção todos os dias. Agende seu exame de vista e veja o mundo com mais clareza. 👓",
     "#OticaDiLorenzo #SaudeOcular #ExameDeVista #Oculos",
     post_comum),
    ("Carnaval",
     "Carnaval chegou! Proteja seus olhos com estilo. Óculos de sol com 20% de desconto essa semana. 🎉☀️",
     "#Carnaval #OticaDiLorenzo #OculosDeSol #Promocao",
     post_carnaval),
    ("Black Friday",
     "Black Friday na Di Lorenzo! Armações com até 40% de desconto. Só esta semana. Não perca! 🖤",
     "#BlackFriday #OticaDiLorenzo #Desconto #Oculos",
     post_blackfriday),
    ("Dia das Mães",
     "Neste Dia das Mães, dê o presente que ela vai usar todos os dias. Armações exclusivas para a mãe especial. 💝",
     "#DiadasMaes #OticaDiLorenzo #Presente #Maes",
     post_maes),
]

if __name__ == "__main__":
    print("Gerando 4 posts...\n")
    images = [(t, c, h, fn()) for t,c,h,fn in POSTS_META]
    print("\nEnviando por e-mail...")
    send_gallery(images, load_env())
