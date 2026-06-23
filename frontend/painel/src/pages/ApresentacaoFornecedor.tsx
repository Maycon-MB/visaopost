import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

const SLIDES = [
  '01-capa.jpg',
  '02-intro.jpg',
  '03-shinehd-easy.jpg',
  '04-shinehd-max.jpg',
  '05-shinehd-full-ar.jpg',
  '06-shinehd-premium.jpg',
  '07-shinehd-top.jpg',
  '08-shinehd-office.jpg',
  '09-shinehd-vszen.jpg',
  '10-myojoy.jpg',
  '11-myojoy-tecnico.jpg',
  '12-trat-antirreflexo.jpg',
  '13-trat-riscos.jpg',
  '14-trat-hidrofobico.jpg',
  '15-trat-oleofobico.jpg',
  '16-trat-antiestatico.jpg',
  '17-trat-estetica.jpg',
].map((f) => `${BASE}/catalogo-fornecedor/${f}`);

export default function ApresentacaoFornecedor() {
  const [idx, setIdx] = useState(0);
  const [entry, setEntry] = useState('right');
  const touchX = useRef(null);
  const nav = useNavigate();

  const go = useCallback((d) => {
    const next = idx + d;
    if (next < 0 || next >= SLIDES.length) return;
    setEntry(d > 0 ? 'right' : 'left');
    setIdx(next);
  }, [idx]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') nav(-1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [go, nav]);

  return (
    <div
      style={R.root}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const delta = touchX.current - e.changedTouches[0].clientX;
        touchX.current = null;
        if (Math.abs(delta) > 55) go(delta > 0 ? 1 : -1);
      }}
    >
      <AfStyles />

      <header style={R.bar}>
        <span style={R.brandName}>Catálogo Shinedux</span>
        <span style={R.counter}>{idx + 1} / {SLIDES.length}</span>
        <button style={R.closeBtn} onClick={() => nav(-1)} aria-label="Fechar apresentação">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div style={R.stage} key={idx} className={`af-slide af-from-${entry}`}>
        <img src={SLIDES[idx]} alt={`Página ${idx + 1}`} style={R.img} />
      </div>

      <footer style={R.nav}>
        <NavBtn onClick={() => go(-1)} disabled={idx === 0} label="Anterior">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </NavBtn>
        <Dots total={SLIDES.length} current={idx} onDot={setIdx} />
        <NavBtn onClick={() => go(1)} disabled={idx === SLIDES.length - 1} label="Próximo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </NavBtn>
      </footer>
    </div>
  );
}

function Dots({ total, current, onDot }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', overflowX: 'auto', maxWidth: '60vw' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          style={{ ...R.dot, ...(i === current ? R.dotOn : {}) }}
          onClick={() => onDot(i)}
          aria-label={`Página ${i + 1}`}
        />
      ))}
    </div>
  );
}

function NavBtn({ onClick, disabled, label, children }) {
  return (
    <button
      style={{ ...R.navBtn, opacity: disabled ? 0.15 : 1, cursor: disabled ? 'default' : 'pointer' }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {children}
    </button>
  );
}

function AfStyles() {
  return (
    <style>{`
      .af-slide {
        animation-duration: 280ms;
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-fill-mode: both;
      }
      .af-from-right { animation-name: af-from-right; }
      .af-from-left  { animation-name: af-from-left; }
      @keyframes af-from-right {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes af-from-left {
        from { opacity: 0; transform: translateX(-40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `}</style>
  );
}

const R = {
  root: {
    position: 'fixed',
    inset: 0,
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
    minHeight: 52,
    color: 'rgba(255,255,255,0.6)',
  },
  brandName: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  counter: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    fontVariantNumeric: 'tabular-nums',
  },
  closeBtn: {
    flexShrink: 0,
    marginLeft: 'auto',
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 0,
    padding: 12,
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: 6,
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
    minHeight: 56,
  },
  navBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: '50%',
    width: 42,
    height: 42,
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
  },
  dotOn: {
    background: '#D4A040',
    width: 18,
    borderRadius: 3,
  },
};
