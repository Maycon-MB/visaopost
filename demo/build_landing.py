"""Gera landing_dilorenzo.html com logo embutida."""
import base64
from pathlib import Path

ROOT = Path(__file__).parent.parent
with open(ROOT / "otica_logo.jpg", "rb") as f:
    LOGO = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()

HTML = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Otica Di Lorenzo - Visao que transforma</title>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
:root{{
  --green:#0D3322;--green-mid:#145238;
  --orange:#D4880A;--orange-light:#F5A623;
  --white:#fff;--gray:#F4F1EC;--text:#1A2E1C;--sub:#5A7A62;
}}
html{{scroll-behavior:smooth}}
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:var(--text)}}
nav{{position:fixed;top:0;left:0;right:0;z-index:100;
  background:rgba(13,51,34,0.97);backdrop-filter:blur(8px);
  padding:14px 40px;display:flex;align-items:center;justify-content:space-between}}
nav .brand-wrap{{display:flex;align-items:center;gap:12px}}
nav img{{width:46px;height:46px;border-radius:50%;object-fit:contain;background:#0D3322;padding:2px}}
nav .brand{{color:#fff;font-weight:800;font-size:17px}}
nav .links{{display:flex;gap:24px}}
nav .links a{{color:rgba(255,255,255,0.75);text-decoration:none;font-size:14px;font-weight:500}}
nav .cta{{background:var(--orange);color:#fff;padding:10px 22px;border-radius:50px;
  font-size:14px;font-weight:700;text-decoration:none}}
.hero{{background:linear-gradient(135deg,#0B1F0F,#0D3322 60%,#145238);
  padding:130px 40px 90px;text-align:center;position:relative;overflow:hidden}}
.hero::after{{content:'';position:absolute;bottom:-80px;right:-80px;
  width:400px;height:400px;border-radius:50%;background:rgba(212,136,10,0.06)}}
.hero-logo{{width:100px;height:100px;border-radius:50%;object-fit:contain;
  background:#0D3322;border:3px solid var(--orange);padding:4px;
  margin:0 auto 24px;display:block}}
.hero h1{{color:#fff;font-size:48px;font-weight:900;letter-spacing:-1px;
  line-height:1.1;margin-bottom:16px}}
.hero h1 span{{color:var(--orange-light)}}
.hero p{{color:rgba(255,255,255,0.72);font-size:18px;max-width:500px;
  margin:0 auto 36px;line-height:1.7}}
.btns{{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}}
.btn-p{{background:var(--orange);color:#fff;padding:16px 32px;border-radius:50px;
  font-size:16px;font-weight:700;text-decoration:none;
  box-shadow:0 6px 20px rgba(212,136,10,0.4)}}
.btn-o{{background:transparent;color:#fff;padding:16px 32px;border-radius:50px;
  font-size:16px;font-weight:600;text-decoration:none;
  border:2px solid rgba(255,255,255,0.3)}}
.stats{{background:var(--orange);padding:20px 40px;
  display:flex;justify-content:center;gap:60px;flex-wrap:wrap}}
.stat .n{{color:#fff;font-size:26px;font-weight:900;text-align:center}}
.stat .l{{color:rgba(255,255,255,0.85);font-size:13px;text-align:center}}
section{{padding:80px 40px;max-width:1000px;margin:0 auto}}
.tag{{font-size:11px;text-transform:uppercase;letter-spacing:2px;
  color:var(--orange);font-weight:700;margin-bottom:10px}}
h2{{font-size:34px;font-weight:900;color:var(--green);letter-spacing:-0.5px;margin-bottom:12px}}
.sub{{font-size:17px;color:var(--sub);margin-bottom:48px;max-width:560px}}
.grid3{{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}}
.card{{background:var(--gray);border-radius:20px;padding:32px 28px;
  border-top:4px solid var(--orange)}}
.card-icon{{font-size:36px;margin-bottom:16px}}
.card h3{{font-size:18px;font-weight:800;color:var(--green);margin-bottom:10px}}
.card p{{font-size:15px;color:var(--sub);line-height:1.7}}
.badge{{display:inline-block;margin-top:16px;background:rgba(212,136,10,0.12);
  color:var(--orange);font-size:11px;font-weight:700;text-transform:uppercase;
  letter-spacing:1px;padding:4px 12px;border-radius:20px}}
.domi{{background:linear-gradient(135deg,var(--green),#145238);
  border-radius:24px;padding:48px;display:flex;align-items:center;
  gap:40px;margin-top:48px}}
.domi h3{{font-size:26px;font-weight:900;color:#fff;margin-bottom:12px}}
.domi p{{font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7;max-width:480px}}
.brands{{background:var(--gray);padding:60px 40px}}
.brands-inner{{max-width:1000px;margin:0 auto;text-align:center}}
.brands-grid{{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-top:36px}}
.pill{{background:#fff;border:1px solid #E0D8CE;border-radius:50px;
  padding:12px 28px;font-size:15px;font-weight:700;color:var(--green)}}
.reviews{{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}}
.review{{background:#fff;border-radius:16px;padding:28px;
  box-shadow:0 2px 16px rgba(0,0,0,0.06);border-left:4px solid var(--orange)}}
.stars{{color:var(--orange);font-size:16px;margin-bottom:12px}}
.review p{{font-size:15px;color:var(--text);line-height:1.7;margin-bottom:16px;font-style:italic}}
.author{{font-size:13px;font-weight:700;color:var(--green)}}
.via{{font-size:11px;color:var(--sub)}}
.info-grid{{display:grid;grid-template-columns:1fr 1fr;gap:32px}}
.info-card{{background:var(--gray);border-radius:20px;padding:36px}}
.info-card h3{{font-size:20px;font-weight:800;color:var(--green);margin-bottom:20px}}
.hour-row{{display:flex;justify-content:space-between;padding:10px 0;
  border-bottom:1px solid #E0D8CE;font-size:15px}}
.hour-row:last-child{{border-bottom:none}}
.hour-row .day{{color:var(--sub)}}
.hour-row .time{{color:var(--green);font-weight:700}}
.map{{background:linear-gradient(135deg,var(--green),#145238);
  border-radius:16px;height:140px;display:flex;align-items:center;
  justify-content:center;flex-direction:column;gap:8px;margin-top:20px}}
.map p{{color:rgba(255,255,255,0.8);font-size:14px}}
.cta-section{{background:linear-gradient(135deg,var(--orange),#C07800);
  padding:80px 40px;text-align:center}}
.cta-section h2{{color:#fff;font-size:36px;margin-bottom:16px}}
.cta-section p{{color:rgba(255,255,255,0.85);font-size:18px;margin-bottom:36px}}
.btn-white{{background:#fff;color:var(--orange);padding:18px 40px;
  border-radius:50px;font-size:17px;font-weight:800;text-decoration:none;
  display:inline-block;box-shadow:0 6px 24px rgba(0,0,0,0.2)}}
.wpp{{position:fixed;bottom:28px;right:28px;z-index:999;
  width:62px;height:62px;border-radius:50%;background:#25D366;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(37,211,102,0.55);text-decoration:none;
  font-size:30px;animation:pw 2s infinite}}
@keyframes pw{{0%,100%{{box-shadow:0 4px 20px rgba(37,211,102,0.55)}}
  50%{{box-shadow:0 4px 36px rgba(37,211,102,0.9)}}}}
footer{{background:var(--green);padding:32px 40px;text-align:center}}
footer p{{color:rgba(255,255,255,0.45);font-size:13px}}
footer strong{{color:var(--orange-light)}}
@media(max-width:700px){{
  .hero h1{{font-size:30px}}
  .grid3,.reviews,.info-grid{{grid-template-columns:1fr}}
  .domi{{flex-direction:column;text-align:center}}
  .stats{{gap:24px}}
  nav .links{{display:none}}
}}
</style>
</head>
<body>

<nav>
  <div class="brand-wrap">
    <img src="{LOGO}" alt="Logo">
    <span class="brand">Otica Di Lorenzo</span>
  </div>
  <div class="links">
    <a href="#servicos">Servicos</a>
    <a href="#marcas">Marcas</a>
    <a href="#horarios">Horarios</a>
  </div>
  <a href="https://wa.me/5500000000000" class="cta">Agendar Exame</a>
</nav>

<div class="hero">
  <img src="{LOGO}" class="hero-logo" alt="Otica Di Lorenzo">
  <h1>Enxergue o mundo<br><span>do jeito que merece</span></h1>
  <p>Exame de vista gratuito, armacoes para todos os estilos e atendimento em domicilio. Cuidando da sua visao com atencao de verdade.</p>
  <div class="btns">
    <a href="https://wa.me/5500000000000" class="btn-p">Agendar Exame Gratuito</a>
    <a href="#servicos" class="btn-o">Ver Servicos</a>
  </div>
</div>

<div class="stats">
  <div class="stat"><div class="n">+500</div><div class="l">Clientes atendidos</div></div>
  <div class="stat"><div class="n">100%</div><div class="l">Exame gratuito</div></div>
  <div class="stat"><div class="n">+20</div><div class="l">Marcas disponiveis</div></div>
  <div class="stat"><div class="n">&#127968;</div><div class="l">Atendimento em domicilio</div></div>
</div>

<section id="servicos">
  <div class="tag">O que oferecemos</div>
  <h2>Tudo para a sua visao</h2>
  <p class="sub">Da consulta ao produto final, com atendimento personalizado.</p>
  <div class="grid3">
    <div class="card">
      <div class="card-icon">&#128065;</div>
      <h3>Exame de Vista Gratuito</h3>
      <p>Avaliacao completa com equipamentos modernos. Sem custo, com agendamento rapido pelo WhatsApp.</p>
      <span class="badge">Gratuito</span>
    </div>
    <div class="card">
      <div class="card-icon">&#128374;</div>
      <h3>Armacoes para Todo Estilo</h3>
      <p>Masculinas, femininas e infantis. Modelos classicos, modernos e esportivos das melhores marcas.</p>
      <span class="badge">+20 marcas</span>
    </div>
    <div class="card">
      <div class="card-icon">&#128300;</div>
      <h3>Lentes e Tratamentos</h3>
      <p>Anti-reflexo, fotossensivel, transitions e multifocal. A lente certa para o seu dia a dia.</p>
      <span class="badge">Alta tecnologia</span>
    </div>
  </div>
  <div class="domi">
    <div style="font-size:72px;flex-shrink:0">&#127968;</div>
    <div>
      <h3>Atendimento em Domicilio</h3>
      <p>Levamos o atendimento completo ate voce. Ideal para quem tem dificuldade de locomocao ou prefere a comodidade de casa. Agende pelo WhatsApp.</p>
    </div>
  </div>
</section>

<div class="brands" id="marcas">
  <div class="brands-inner">
    <div class="tag">Parceiros</div>
    <h2>Marcas que trabalhamos</h2>
    <p style="color:var(--sub);font-size:17px;margin-top:8px">Selecao das melhores marcas para garantir qualidade e estilo.</p>
    <div class="brands-grid">
      <div class="pill">Ray-Ban</div>
      <div class="pill">Oakley</div>
      <div class="pill">Hugo Boss</div>
      <div class="pill">Prada</div>
      <div class="pill">Chilli Beans</div>
      <div class="pill">Mormaii</div>
      <div class="pill">Calvin Klein</div>
      <div class="pill">Carrera</div>
    </div>
  </div>
</div>

<section>
  <div class="tag">Avaliacoes</div>
  <h2>O que nossos clientes dizem</h2>
  <p class="sub">Mais de 4.9 estrelas no Google.</p>
  <div class="reviews">
    <div class="review">
      <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p>"Atendimento incrivel! Fiz o exame gratuito e sai com meus oculos novos no mesmo dia. Super recomendo!"</p>
      <div class="author">Ana Clara S.</div>
      <div class="via">Google &middot; ha 2 semanas</div>
    </div>
    <div class="review">
      <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p>"Solicitei o atendimento em domicilio para minha mae idosa. Foram super pontuais e profissionais!"</p>
      <div class="author">Carlos M.</div>
      <div class="via">Google &middot; ha 1 mes</div>
    </div>
    <div class="review">
      <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p>"Otima variedade de armacoes e precos justos. Me ajudaram a escolher o modelo perfeito. Voltarei sempre!"</p>
      <div class="author">Fernanda O.</div>
      <div class="via">Google &middot; ha 3 semanas</div>
    </div>
  </div>
</section>

<section id="horarios">
  <div class="tag">Informacoes</div>
  <h2>Horarios e localizacao</h2>
  <p class="sub">Presencialmente ou em domicilio, estamos prontos para atender.</p>
  <div class="info-grid">
    <div class="info-card">
      <h3>&#8987; Horario de funcionamento</h3>
      <div class="hour-row"><span class="day">Segunda a Sexta</span><span class="time">08h - 18h</span></div>
      <div class="hour-row"><span class="day">Sabado</span><span class="time">08h - 13h</span></div>
      <div class="hour-row"><span class="day">Domingo</span><span class="time">Fechado</span></div>
      <a href="https://wa.me/5500000000000"
         style="display:block;margin-top:24px;background:var(--orange);color:#fff;
                text-align:center;padding:14px;border-radius:12px;font-weight:700;
                text-decoration:none;font-size:15px">
        Agendar pelo WhatsApp
      </a>
    </div>
    <div class="info-card">
      <h3>&#128205; Onde estamos</h3>
      <p style="font-size:15px;color:var(--sub);line-height:1.7">
        Centro &mdash; [Sua Cidade], [Estado]<br>
        Proximo a [ponto de referencia]
      </p>
      <div class="map">
        <span style="font-size:32px">&#128506;</span>
        <p>Ver no Google Maps</p>
      </div>
    </div>
  </div>
</section>

<div class="cta-section">
  <h2>Cuide da sua visao hoje</h2>
  <p>Agende seu exame gratuito em menos de 1 minuto pelo WhatsApp.</p>
  <a href="https://wa.me/5500000000000" class="btn-white">Agendar agora &mdash; e gratuito</a>
</div>

<footer>
  <p><strong>Otica Di Lorenzo</strong> &middot; Seg-Sex 8h-18h &middot; Sab 8h-13h</p>
  <p style="margin-top:6px">Todos os direitos reservados &copy; 2026</p>
</footer>

<a href="https://wa.me/5500000000000" class="wpp" title="WhatsApp">&#128172;</a>

</body>
</html>"""

out = ROOT / "landing_dilorenzo.html"
out.write_text(HTML, encoding="utf-8")
print(f"OK: {out}")
