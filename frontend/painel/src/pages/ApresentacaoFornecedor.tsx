import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

const SLIDE_DETAILS = [
  { file: '01-capa.jpg', title: 'Capa do Catálogo' },
  { file: '02-intro.jpg', title: 'Tecnologias & Diferenciais' },
  { file: '03-shinehd-easy.jpg', title: 'ShineHD Easy' },
  { file: '04-shinehd-max.jpg', title: 'ShineHD Max' },
  { file: '05-shinehd-full-ar.jpg', title: 'ShineHD Full (AR)' },
  { file: '06-shinehd-premium.jpg', title: 'ShineHD Premium' },
  { file: '07-shinehd-top.jpg', title: 'ShineHD Top' },
  { file: '08-shinehd-office.jpg', title: 'ShineHD Office' },
  { file: '09-shinehd-vszen.jpg', title: 'ShineHD V.S. Zen' },
  { file: '10-myojoy.jpg', title: 'Myojoy Miopia' },
  { file: '11-myojoy-tecnico.jpg', title: 'Myojoy Detalhes Técnicos' },
  { file: '12-trat-antirreflexo.jpg', title: 'Antirreflexo' },
  { file: '13-trat-riscos.jpg', title: 'Resistência a Riscos' },
  { file: '14-trat-hidrofobico.jpg', title: 'Tratamento Hidrofóbico' },
  { file: '15-trat-oleofobico.jpg', title: 'Tratamento Oleofóbico' },
  { file: '16-trat-antiestatico.jpg', title: 'Tratamento Antiestático' },
  { file: '17-trat-estetica.jpg', title: 'Tratamento Estética' },
];

const SLIDES = SLIDE_DETAILS.map((d) => `${BASE}/catalogo-fornecedor/${d.file}`);

export default function ApresentacaoFornecedor() {
  const [viewMode, setViewMode] = useState<'grid' | 'fullscreen'>('grid');
  const [idx, setIdx] = useState(0);
  const [entry, setEntry] = useState('right');
  const touchX = useRef<number | null>(null);
  const nav = useNavigate();

  const go = useCallback((d: number) => {
    const next = idx + d;
    if (next < 0 || next >= SLIDES.length) return;
    setEntry(d > 0 ? 'right' : 'left');
    setIdx(next);
  }, [idx]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (viewMode === 'fullscreen') {
        if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'Escape') setViewMode('grid');
      } else {
        if (e.key === 'Escape') nav(-1);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [go, nav, viewMode]);

  if (viewMode === 'grid') {
    return (
      <div style={R.root}>
        <AfStyles />

        <header style={R.bar}>
          <span style={R.brandName}>Catálogo Shinedux</span>
          <button
            className="af-start-btn"
            style={R.startBtn}
            onClick={() => {
              setIdx(0);
              setViewMode('fullscreen');
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
            Apresentação Geral
          </button>
          <button style={R.closeBtn} onClick={() => nav(-1)} aria-label="Fechar catálogo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div style={R.gridContainer} className="af-grid-fade">
          <div style={R.gridHeader}>
            <h2 style={R.gridTitle}>Especificações de Lentes</h2>
            <p style={R.gridSubtitle}>Selecione uma página para abrir em tela cheia no balcão</p>
          </div>
          <div style={R.grid}>
            {SLIDE_DETAILS.map((slide, i) => (
              <div
                key={i}
                className="af-grid-card"
                onClick={() => {
                  setIdx(i);
                  setViewMode('fullscreen');
                }}
              >
                <div style={R.cardImgWrapper}>
                  <img src={SLIDES[i]} alt={slide.title} style={R.cardImg} loading="lazy" />
                  <span style={R.cardBadge}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div style={R.cardTitle}>{slide.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        <button
          className="af-back-btn"
          style={R.backBtn}
          onClick={() => setViewMode('grid')}
          aria-label="Voltar para o catálogo"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Catálogo
        </button>
        <span style={R.brandName}>{SLIDE_DETAILS[idx].title}</span>
        <span style={R.counter}>{idx + 1} / {SLIDES.length}</span>
        <button style={R.closeBtn} onClick={() => setViewMode('grid')} aria-label="Voltar ao catálogo">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div style={R.stage} key={idx} className={`af-slide af-from-${entry}`}>
        <img src={SLIDES[idx]} alt={SLIDE_DETAILS[idx].title} style={R.img} />
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

interface DotsProps {
  total: number;
  current: number;
  onDot: (index: number) => void;
}

function Dots({ total, current, onDot }: DotsProps) {
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

interface NavBtnProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}

function NavBtn({ onClick, disabled, label, children }: NavBtnProps) {
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

      /* Grid de Catálogo */
      .af-grid-card {
        background: #141414;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        padding: 12px;
        cursor: pointer;
        transition: transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    border-color 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    box-shadow 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    background 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;
        overflow: hidden;
      }
      .af-grid-card:hover {
        transform: translateY(-4px);
        border-color: #D4A040;
        box-shadow: 0 8px 24px rgba(212, 160, 64, 0.18);
        background: #1a1a1a;
      }
      .af-grid-card:active {
        transform: translateY(-2px);
      }
      .af-start-btn:hover {
        background: rgba(212, 160, 64, 0.25) !important;
        border-color: #D4A040 !important;
        color: #fff !important;
      }
      .af-back-btn:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        border-color: rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
      }

      /* Fade in da grade */
      .af-grid-fade {
        animation: af-fade-in 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
      }
      @keyframes af-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

const R = {
  root: {
    position: 'fixed' as const,
    inset: 0,
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    WebkitUserSelect: 'none' as const,
    userSelect: 'none' as const,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.02em',
    color: '#fff',
  },
  counter: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    fontVariantNumeric: 'tabular-nums',
  },
  closeBtn: {
    flexShrink: 0,
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
    transition: 'all 150ms ease',
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
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
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
  /* Novos Estilos do Modo Grade */
  gridContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
    WebkitOverflowScrolling: 'touch' as const,
  },
  gridHeader: {
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 4px 0',
  },
  gridSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 24,
  },
  cardImgWrapper: {
    position: 'relative' as const,
    aspectRatio: '4/3',
    background: '#0d0d0d',
    borderRadius: 6,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  cardBadge: {
    position: 'absolute' as const,
    top: 6,
    left: 6,
    background: 'rgba(0, 0, 0, 0.75)',
    color: '#D4A040',
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 4,
    fontVariantNumeric: 'tabular-nums',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.3,
    padding: '0 2px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  startBtn: {
    background: 'rgba(212, 160, 64, 0.15)',
    border: '1px solid rgba(212, 160, 64, 0.3)',
    color: '#D4A040',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 10,
    transition: 'all 150ms ease',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: 6,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    transition: 'all 150ms ease',
  },
};
