import { useRef, useState } from 'react';
import { useTheme } from '../theme-context.jsx';

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-10" /></svg>
);
const Sun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" /></svg>
);
const Auto = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
);

// Regras prontas pra ligar/desligar (além do texto livre).
const POST_RULES = [
  { id: 'no_red', ct: 'Evitar a cor vermelha', cd: 'A IA não usa vermelho nas artes.' },
  { id: 'city', ct: 'Sempre citar a cidade', cd: 'Menciona "ótica em BH" nas primeiras linhas.' },
  { id: 'premium', ct: 'Foco em armações premium', cd: 'Dá destaque pras peças mais sofisticadas.' },
  { id: 'promo', ct: 'Lembrar a promoção do mês', cd: 'Inclui chamada pra oferta vigente quando fizer sentido.' },
];
const BOT_RULES = [
  { id: 'hours', ct: 'Informar horário de funcionamento', cd: 'Responde sozinho quando perguntam se está aberto.' },
  { id: 'schedule', ct: 'Agendar exame de vista', cd: 'Coleta nome e dia preferido e marca o horário.' },
  { id: 'insurance', ct: 'Responder sobre convênios', cd: 'Diz quais planos a ótica aceita.' },
  { id: 'handoff', ct: 'Chamar você em pedido de desconto', cd: 'Transfere pra um humano quando foge do padrão.' },
];

function AvatarEditor() {
  const [src, setSrc] = useState(null);
  const [zoom, setZoom] = useState(1.2);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const drag = useRef(null);
  const fileRef = useRef(null);

  const clamp = (v) => Math.max(0, Math.min(100, v));
  const start = (cx, cy) => { drag.current = { cx, cy, ...pos }; };
  const moveTo = (cx, cy) => {
    if (!drag.current) return;
    const dx = cx - drag.current.cx;
    const dy = cy - drag.current.cy;
    setPos({ x: clamp(drag.current.x - dx / 2.4), y: clamp(drag.current.y - dy / 2.4) });
  };
  const end = () => { drag.current = null; };

  function onFile(e) {
    const f = e.target.files?.[0];
    if (f) { setSrc(URL.createObjectURL(f)); setPos({ x: 50, y: 50 }); setZoom(1.2); }
  }

  return (
    <div className="avatar-row">
      <div
        className="avatar-edit"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); start(e.clientX, e.clientY); }}
        onPointerMove={(e) => moveTo(e.clientX, e.clientY)}
        onPointerUp={end}
        onPointerCancel={end}
        title={src ? 'Arraste pra posicionar' : 'Escolha uma foto'}
      >
        {src
          ? <img src={src} alt="" style={{ objectPosition: `${pos.x}% ${pos.y}%`, transform: `scale(${zoom})` }} />
          : <div className="avatar-empty">M</div>}
      </div>
      <div className="avatar-ctrls">
        <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 44, padding: '0 18px', fontSize: 13 }} onClick={() => fileRef.current?.click()}>
          {src ? 'Trocar foto' : 'Escolher foto'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        {src && (
          <div className="range-zoom">
            <span className="muted" style={{ fontSize: 12 }}>zoom</span>
            <input type="range" min="1" max="2.5" step="0.01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </div>
        )}
        <span className="avatar-hint">{src ? 'Arraste a foto dentro do círculo pra enquadrar.' : 'Quadrada fica melhor. Você ajusta o enquadramento.'}</span>
      </div>
    </div>
  );
}

function CheckRow({ on, onToggle, ct, cd }) {
  return (
    <div className={`check-row ${on ? 'on' : ''}`} onClick={onToggle} role="checkbox" aria-checked={on} tabIndex={0}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), onToggle())}>
      <span className="check-box"><Check /></span>
      <span className="check-main">
        <div className="ct">{ct}</div>
        <div className="cd">{cd}</div>
      </span>
    </div>
  );
}

export default function Settings() {
  const { mode, setMode } = useTheme();
  const [active, setActive] = useState([1, 2, 3, 4, 5, 6]);
  const [sendHour, setSendHour] = useState('06:00');
  const [pubHour, setPubHour] = useState('12:00');
  const [name, setName] = useState('Marcelo');
  const [phone, setPhone] = useState('(31) 99999-0000');
  const [email, setEmail] = useState('marcelo@oticadilorenzo.com.br');
  const [postOn, setPostOn] = useState({ no_red: true, city: true, premium: false, promo: false });
  const [botOn, setBotOn] = useState({ hours: true, schedule: true, insurance: true, handoff: true });
  const [postFree, setPostFree] = useState('');
  const [botFree, setBotFree] = useState('Garantia de 12 meses na armação. Entrega de óculos em até 7 dias úteis.');

  const toggleDay = (i) => setActive((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i]);
  const THEMES = [['light', 'Claro', Sun], ['dark', 'Escuro', Moon], ['auto', 'Automático', Auto]];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="dash-hello">Configurações</h1>
          <p className="dash-sub">Seu perfil, a cara do painel e como a gente trabalha pra você.</p>
        </div>
      </div>

      {/* Perfil */}
      <section className="set-section">
        <div className="set-section-head">
          <div className="set-section-title">Seu perfil</div>
          <div className="set-section-desc">Como você aparece no painel e onde a gente te avisa.</div>
        </div>
        <div className="card-aotelier">
          <AvatarEditor />
          <hr className="hairline" style={{ margin: '22px 0' }} />
          <div className="field-grid two">
            <div>
              <label className="label-atelier">Nome</label>
              <input className="input-atelier" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="label-atelier">WhatsApp</label>
              <input className="input-atelier" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="label-atelier">Email</label>
            <input type="email" className="input-atelier" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="help-atelier">É pra cá que mandamos o post do dia pra você aprovar.</div>
          </div>
        </div>
      </section>

      {/* Aparência */}
      <section className="set-section">
        <div className="set-section-head">
          <div className="set-section-title">Aparência</div>
          <div className="set-section-desc">Escolha o visual do painel. "Automático" segue o seu celular.</div>
        </div>
        <div className="card-aotelier">
          <div className="theme-seg">
            {THEMES.map(([k, lbl, Ico]) => (
              <button key={k} className={`theme-opt ${mode === k ? 'active' : ''}`} onClick={() => setMode(k)}>
                <Ico /> {lbl}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section className="set-section">
        <div className="set-section-head">
          <div className="set-section-title">Quando publicar</div>
          <div className="set-section-desc">Horário que você recebe pra aprovar e em que dias quer post.</div>
        </div>
        <div className="card-aotelier">
          <div className="field-grid two">
            <div>
              <label className="label-atelier">Recebo pra aprovar às</label>
              <input type="time" className="input-atelier" style={{ maxWidth: 180 }} value={sendHour} onChange={(e) => setSendHour(e.target.value)} />
            </div>
            <div>
              <label className="label-atelier">Publica no Instagram às</label>
              <input type="time" className="input-atelier" style={{ maxWidth: 180 }} value={pubHour} onChange={(e) => setPubHour(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <label className="label-atelier">Dias com post</label>
            <div className="day-grid">
              {DAYS.map((d, i) => (
                <button key={i} className={`day-btn ${active.includes(i) ? 'active' : ''}`} onClick={() => toggleDay(i)} aria-pressed={active.includes(i)}>{d}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regras do conteúdo */}
      <section className="set-section">
        <div className="set-section-head">
          <div className="set-section-title">Como criar seus posts</div>
          <div className="set-section-desc">Marque o que importa — e escreva o resto do seu jeito.</div>
        </div>
        <div className="card-aotelier">
          <div className="check-list">
            {POST_RULES.map((r) => (
              <CheckRow key={r.id} on={!!postOn[r.id]} onToggle={() => setPostOn((s) => ({ ...s, [r.id]: !s[r.id] }))} ct={r.ct} cd={r.cd} />
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="label-atelier">Mais alguma coisa? (opcional)</label>
            <textarea className="textarea-atelier" value={postFree} onChange={(e) => setPostFree(e.target.value)} maxLength={1000} placeholder="Ex.: gosto de frases curtas, evito gírias, sempre assino com 'Família Di Lorenzo'." />
          </div>
        </div>
      </section>

      {/* Regras do bot */}
      <section className="set-section">
        <div className="set-section-head">
          <div className="set-section-title">O atendente do WhatsApp</div>
          <div className="set-section-desc">O que ele pode resolver sozinho e quando chama você.</div>
        </div>
        <div className="card-aotelier">
          <div className="check-list">
            {BOT_RULES.map((r) => (
              <CheckRow key={r.id} on={!!botOn[r.id]} onToggle={() => setBotOn((s) => ({ ...s, [r.id]: !s[r.id] }))} ct={r.ct} cd={r.cd} />
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="label-atelier">Informações que ele deve saber</label>
            <textarea className="textarea-atelier" style={{ minHeight: 140 }} value={botFree} onChange={(e) => setBotFree(e.target.value)} maxLength={2000} placeholder="Horários, convênios aceitos, política de garantia, tempo de entrega…" />
            <div className="help-atelier">Quanto mais detalhe, menos ele precisa te chamar.</div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 48, padding: '0 22px' }}>Cancelar</button>
        <button className="btn-touch btn-primary-atelier" style={{ minHeight: 48, padding: '0 28px' }}>Salvar alterações</button>
      </div>

      <p className="muted" style={{ marginTop: 24, fontSize: 12.5, textAlign: 'center' }}>
        Persistência liga em <code style={{ background: 'var(--ivory-soft)', padding: '2px 6px', borderRadius: 4 }}>PATCH /api/settings</code> (backend já pronto). Tema já salva no navegador.
      </p>
    </>
  );
}
