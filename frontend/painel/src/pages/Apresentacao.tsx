import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProducts } from '../api.js';

export default function Apresentacao() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('Tudo');
  const [idx, setIdx] = useState(0);
  const [entry, setEntry] = useState('right');
  const touchX = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    listProducts({ includeInactive: false }).then(setProducts).finally(() => setLoading(false));
  }, []);

  const cats = ['Tudo', ...[...new Set(products.map((p) => p.category))].filter(Boolean)];
  const visible = cat === 'Tudo' ? products : products.filter((p) => p.category === cat);
  const current = visible[idx] ?? null;

  function changeCat(c) { setCat(c); setIdx(0); setEntry('right'); }

  const go = useCallback((d) => {
    const next = idx + d;
    if (next < 0 || next >= visible.length) return;
    setEntry(d > 0 ? 'right' : 'left');
    setIdx(next);
  }, [idx, visible.length]);

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
      <ApStyles />

      {/* Top bar */}
      <header style={R.bar}>
        <div style={R.barLeft}>
          <span style={R.brand}>✻</span>
          <span style={R.brandName}>Di Lorenzo</span>
        </div>
        <div style={R.catScroll}>
          {cats.map((c) => (
            <button
              key={c}
              style={{ ...R.catBtn, ...(cat === c ? R.catOn : {}) }}
              onClick={() => changeCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <button style={R.closeBtn} onClick={() => nav(-1)} aria-label="Fechar apresentação">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Content */}
      {loading ? (
        <div style={R.center}>
          <div className="ap-spinner" />
        </div>
      ) : !current ? (
        <div style={R.center}>
          <p style={R.emptyMsg}>Nenhum produto nessa categoria.</p>
        </div>
      ) : (
        <Slide key={`${cat}-${idx}`} product={current} entry={entry} />
      )}

      {/* Bottom nav */}
      {!loading && visible.length > 0 && (
        <footer style={R.nav}>
          <NavBtn onClick={() => go(-1)} disabled={idx === 0} label="Anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </NavBtn>
          <Dots total={Math.min(visible.length, 14)} current={idx} onDot={setIdx} extra={visible.length > 14 ? `${idx + 1} / ${visible.length}` : null} />
          <NavBtn onClick={() => go(1)} disabled={idx === visible.length - 1} label="Próximo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </NavBtn>
        </footer>
      )}
    </div>
  );
}

function Slide({ product, entry }) {
  const price = product.price_brl == null
    ? null
    : `R$ ${Number(product.price_brl).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className={`ap-slide ap-from-${entry}`} style={R.slide}>
      {/* Image */}
      <div className="ap-img-panel" style={R.imgPanel}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={R.img} />
        ) : (
          <div style={R.imgEmpty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {/* Subtle category watermark */}
        <div style={R.imgWatermark}>{product.category}</div>
      </div>

      {/* Info */}
      <div className="ap-info-panel" style={R.info}>
        <div style={R.infoInner}>
          <div style={R.catTag}>{product.category}</div>
          <h1 style={R.name}>{product.name}</h1>

          {price && <div style={R.price}>{price}</div>}

          {product.features?.length > 0 && (
            <>
              <div style={R.divider} />
              <ul style={R.feats}>
                {product.features.map((f, i) => (
                  <li key={i} style={R.feat}>
                    <span style={R.bullet}>✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {product.description && (
            <p style={R.desc}>{product.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Dots({ total, current, onDot, extra }) {
  return (
    <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          style={{ ...R.dot, ...(i === current ? R.dotOn : {}) }}
          onClick={() => onDot(i)}
          aria-label={`Produto ${i + 1}`}
        />
      ))}
      {extra && (
        <span style={R.dotExtra}>{extra}</span>
      )}
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

function ApStyles() {
  return (
    <style>{`
      .ap-slide {
        animation-duration: 340ms;
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-fill-mode: both;
      }
      .ap-from-right { animation-name: ap-from-right; }
      .ap-from-left  { animation-name: ap-from-left; }
      @keyframes ap-from-right {
        from { opacity: 0; transform: translateX(56px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes ap-from-left {
        from { opacity: 0; transform: translateX(-56px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      .ap-spinner {
        width: 30px; height: 30px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.08);
        border-top-color: #2E8B57;
        animation: ap-spin 700ms linear infinite;
      }
      @keyframes ap-spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .ap-slide { flex-direction: column !important; }
        .ap-img-panel {
          flex: 0 0 44vw !important;
          height: 44vw !important;
          border-right: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .ap-info-panel {
          padding: 22px 24px !important;
          flex: 1 !important;
        }
      }

      @media (min-width: 641px) and (max-width: 900px) {
        .ap-img-panel { flex: 0 0 42% !important; }
        .ap-info-panel { padding: 28px 32px !important; }
      }
    `}</style>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────── */

const R = {
  root: {
    position: 'fixed',
    inset: 0,
    background: '#060e08',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'var(--font-body)',
    color: '#e4ebe6',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  },

  /* Bar */
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
    minHeight: 52,
  },
  barLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    flexShrink: 0,
  },
  brand: {
    color: '#2E8B57',
    fontSize: 14,
  },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.01em',
  },
  catScroll: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    flexShrink: 1,
    minWidth: 0,
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    paddingBottom: 1,
  },
  catBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.4)',
    borderRadius: 999,
    padding: '7px 14px',
    fontSize: 12,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    flexShrink: 0,
    transition: 'background 150ms, border-color 150ms, color 150ms',
  },
  catOn: {
    background: 'rgba(26, 92, 61, 0.45)',
    borderColor: '#2E8B57',
    color: '#b0d4be',
  },
  closeBtn: {
    flexShrink: 0,
    marginLeft: 'auto',
    width: 34,
    height: 41,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 150ms',
  },

  /* Center (loading / empty) */
  center: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMsg: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 20,
    color: 'rgba(255,255,255,0.2)',
    margin: 0,
  },

  /* Slide */
  slide: {
    flex: '1 1 0',
    display: 'flex',
    overflow: 'hidden',
    minHeight: 0,
    alignItems: 'stretch',
  },
  imgPanel: {
    flex: '0 0 50%',
    alignSelf: 'stretch',
    position: 'relative',
    overflow: 'hidden',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a1410',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '28px 20px',
  },
  imgEmpty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  imgWatermark: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.12)',
  },

  /* Info */
  info: {
    flex: '0 0 50%',
    alignSelf: 'stretch',
    overflowY: 'auto',
    padding: '40px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  catTag: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#3EA86E',
    marginBottom: 12,
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: 'clamp(26px, 4vw, 52px)',
    lineHeight: 1.08,
    margin: '0 0 20px',
    color: '#eaf0eb',
    letterSpacing: '-0.01em',
  },
  price: {
    fontSize: 20,
    fontWeight: 600,
    color: '#D4A040',
    marginBottom: 24,
    letterSpacing: '-0.01em',
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.07)',
    marginBottom: 22,
  },
  feats: {
    listStyle: 'none',
    margin: '0 0 20px',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 13,
  },
  feat: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    fontSize: 15,
    lineHeight: 1.45,
    color: 'rgba(228,235,230,0.8)',
  },
  bullet: {
    color: '#3EA86E',
    flexShrink: 0,
    fontSize: 8,
    marginTop: 5,
  },
  desc: {
    margin: 0,
    fontSize: 13,
    color: 'rgba(228,235,230,0.32)',
    lineHeight: 1.7,
  },

  /* Nav */
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
    minHeight: 56,
  },
  navBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: '50%',
    width: 42,
    height: 42,
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 120ms',
    flexShrink: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 200ms ease',
    flexShrink: 0,
  },
  dotOn: {
    background: '#2E8B57',
    width: 20,
    borderRadius: 3,
  },
  dotExtra: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    marginLeft: 4,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.04em',
  },
};
