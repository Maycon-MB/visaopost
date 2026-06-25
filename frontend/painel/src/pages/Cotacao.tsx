import { useState } from 'react';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';
function img(file: string) { return `${BASE}/catalogo-fornecedor/${file}`; }

// ─── Dados ────────────────────────────────────────────────────────────────────

const LENSES = [
  { id: 'full',    name: 'HD Full',    image: img('05-shinehd-full-ar.jpg'),  benefits: ['Custo-benefício', 'Graus baixos', 'Fácil adaptação'] },
  { id: 'easy',    name: 'HD Easy',    image: img('03-shinehd-easy.jpg'),     benefits: ['Menos distorção', 'Conforto cotidiano', 'Boa adaptação'] },
  { id: 'top',     name: 'HD Top',     image: img('07-shinehd-top.jpg'),      benefits: ['Campo amplo', 'Alta definição', 'Ideal progressivos'] },
  { id: 'premium', name: 'HD Premium', image: img('06-shinehd-premium.jpg'),  benefits: ['Periferia nítida', 'Alta correção', 'Alto conforto'] },
  { id: 'max',     name: 'HD Max',     image: img('04-shinehd-max.jpg'),      benefits: ['Máxima precisão', 'Campo quase total', 'Alta tecnologia'] },
  { id: '4k',      name: 'HD 4K',      image: null,                           benefits: ['Visão cristalina', 'Zero distorção', 'Topo de linha'] },
] as const;

const TREATMENTS = [
  { id: 'antireflexo',   name: 'Anti-reflexo',   img: img('trat-com-sem-antireflexo.jpg') },
  { id: 'hidrofobico',   name: 'Hidrofóbico',    img: img('trat-com-sem-hidrofobico.jpg') },
  { id: 'antirrisco',    name: 'Anti-risco',      img: img('trat-com-sem-antirrisco.jpg') },
  { id: 'antiestatico',  name: 'Anti-estático',   img: img('trat-com-sem-antiestatico.jpg') },
  { id: 'crizal',        name: 'Crizal',          img: img('trat-com-sem-estetica.jpg') },
  { id: 'filtroazul',    name: 'Filtro Azul',     img: null },
  { id: 'fotocromatico', name: 'Fotocromático',   img: null },
] as const;

const FEES: Record<number, number> = {
  6: 9.95, 7: 10.55, 8: 10.95, 9: 11.95,
  10: 11.99, 11: 11.99, 12: 11.99,
};

type LensId    = typeof LENSES[number]['id'];
type TreatId   = typeof TREATMENTS[number]['id'];
type PayMethod = 'pix' | 'dinheiro' | 'debito' | 'credito';

// ─── Utils ────────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}
function parseVal(s: string): number {
  const n = parseFloat(s.replace(',', '.'));
  return isNaN(n) || n < 0 ? 0 : n;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(3,25,30,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <img
        src={src} alt={alt}
        style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 18, right: 18,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)', border: 'none',
          color: 'white', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Fechar"
      >✕</button>
    </div>
  );
}

// ─── SVG HD 4K (sem foto de catálogo) ────────────────────────────────────────

function LensVision4K() {
  return (
    <svg viewBox="0 0 200 130" style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden>
      <defs>
        <radialGradient id="lg4k" cx="50%" cy="50%" r="50%">
          <stop offset="88%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(195,180,150,0.12)" />
        </radialGradient>
        <clipPath id="cl4k"><ellipse cx={100} cy={65} rx={88} ry={52} /></clipPath>
      </defs>
      <ellipse cx={100} cy={65} rx={88} ry={52} fill="rgba(246,248,255,0.96)" />
      <rect x={0} y={0} width={200} height={130} fill="url(#lg4k)" clipPath="url(#cl4k)" />
      <ellipse cx={100} cy={65} rx={88} ry={52} fill="none" stroke="rgba(160,148,128,0.4)" strokeWidth="1" />
      <text x={100} y={62} textAnchor="middle" fontSize="14" fill="#C1750B"
        fontFamily="Jost, sans-serif" fontWeight="700" letterSpacing="0.04em">HD 4K</text>
      <text x={100} y={80} textAnchor="middle" fontSize="9.5" fill="#9A8E7A"
        fontFamily="Jost, sans-serif" letterSpacing="0.06em">campo máximo</text>
    </svg>
  );
}

// ─── Card de Lente ────────────────────────────────────────────────────────────

interface LensCardProps {
  lens: typeof LENSES[number];
  selected: boolean;
  price: string;
  onSelect: () => void;
  onPrice: (v: string) => void;
  onViewImg: (src: string, alt: string) => void;
}

function LensCard({ lens, selected, price, onSelect, onPrice, onViewImg }: LensCardProps) {
  return (
    <div
      role="button" tabIndex={0} aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onSelect(); }}
      style={{
        border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--hairline)'}`,
        borderRadius: 'var(--r-card)',
        padding: '0 0 14px',
        cursor: 'pointer',
        background: selected ? 'rgba(193,117,11,0.04)' : 'var(--surface)',
        boxShadow: selected ? '0 0 0 3px rgba(193,117,11,0.14)' : 'none',
        transition: 'border-color 160ms, box-shadow 160ms, background 160ms',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none',
      }}
    >
      {/* Fundo escuro + contain = slide completo visível */}
      <div
        onClick={(e) => {
          if (lens.image) {
            e.stopPropagation();
            onViewImg(lens.image, lens.name);
          }
        }}
        style={{
          background: '#0d1d22', aspectRatio: '4/3', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: lens.image ? 'zoom-in' : 'default',
        }}
      >
        {lens.image
          ? <img src={lens.image} alt={lens.name} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          : <LensVision4K />
        }
      </div>

      <div style={{
        margin: '10px 12px 5px', fontWeight: 600, fontSize: 14,
        color: selected ? 'var(--primary)' : 'var(--ink)',
      }}>
        {lens.name}
      </div>

      <ul style={{ margin: '0 12px 10px', padding: 0, listStyle: 'none', fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.7 }}>
        {lens.benefits.map(b => (
          <li key={b} style={{ display: 'flex', gap: 4, alignItems: 'baseline' }}>
            <span style={{ color: selected ? 'var(--primary)' : 'var(--champagne)', fontSize: 8 }}>▪</span>
            {b}
          </li>
        ))}
      </ul>

      <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 4 }}
        onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: 11, color: 'var(--ink-mute)', flexShrink: 0 }}>R$</span>
        <input
          type="number" min={0} step={10}
          value={price} placeholder="0"
          onChange={(e) => onPrice(e.target.value)}
          style={{
            width: '100%', border: 'none',
            borderBottom: `1px solid ${selected ? 'var(--primary)' : 'var(--hairline)'}`,
            background: 'transparent', fontSize: 16, fontWeight: 700,
            color: selected ? 'var(--primary)' : 'var(--ink)',
            padding: '2px 0', outline: 'none', fontFamily: 'var(--font-body)',
          }}
          aria-label={`Preço ${lens.name}`}
        />
      </div>
    </div>
  );
}

// ─── Linha de Tratamento ──────────────────────────────────────────────────────

interface TreatRowProps {
  treat: typeof TREATMENTS[number];
  active: boolean;
  price: string;
  onToggle: () => void;
  onPrice: (v: string) => void;
  onViewImg: (src: string, alt: string) => void;
}

function TreatRow({ treat, active, price, onToggle, onPrice, onViewImg }: TreatRowProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          background: active ? 'rgba(193,117,11,0.035)' : 'transparent',
          cursor: 'pointer', userSelect: 'none', transition: 'background 140ms',
        }}
        onClick={onToggle} role="checkbox" aria-checked={active} tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onToggle(); }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          border: `2px solid ${active ? 'var(--primary)' : 'var(--hairline-strong)'}`,
          background: active ? 'var(--primary)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms',
        }}>
          {active && (
            <svg viewBox="0 0 12 10" width="11" height="9" aria-hidden>
              <path d="M1 5l3.2 4L11 1" stroke="white" strokeWidth="1.9"
                fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <span style={{ flex: 1, fontSize: 15, color: active ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: active ? 500 : 400 }}>
          {treat.name}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={(e) => e.stopPropagation()}>
          <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>R$</span>
          <input
            type="number" min={0} step={5}
            value={price} placeholder="0"
            onChange={(e) => onPrice(e.target.value)}
            style={{
              width: 72, textAlign: 'right', border: 'none',
              borderBottom: `1px solid ${active ? 'var(--primary)' : 'var(--hairline)'}`,
              background: 'transparent', fontSize: 15, fontWeight: 500,
              color: active ? 'var(--primary)' : 'var(--ink-mute)',
              padding: '2px 0', outline: 'none', fontFamily: 'var(--font-body)',
            }}
            aria-label={`Preço ${treat.name}`}
          />
        </div>
      </div>

      {/* Imagem COM/SEM sempre visível — toque abre lightbox */}
      {treat.img && (
        <div style={{ padding: '0 16px 14px' }}>
          <button
            onClick={() => onViewImg(treat.img!, treat.name)}
            style={{
              display: 'block', width: '100%', padding: 0,
              border: `1px solid ${active ? 'rgba(193,117,11,0.25)' : 'var(--hairline)'}`,
              borderRadius: 8, overflow: 'hidden', cursor: 'zoom-in',
              background: 'none', transition: 'border-color 160ms',
            }}
            title={`Ampliar: ${treat.name}`}
          >
            <img src={treat.img} alt={`COM e SEM ${treat.name}`} loading="lazy"
              style={{ width: '100%', display: 'block' }} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Ícone PIX ────────────────────────────────────────────────────────────────

function PixIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="currentColor">
      <path d="M5.6 8.4 2 12l3.6 3.6a1.5 1.5 0 0 0 2.1 0l3.7-3.7a.8.8 0 0 1 1.2 0l3.7 3.7a1.5 1.5 0 0 0 2.1 0L22 12l-3.6-3.6a1.5 1.5 0 0 0-2.1 0l-3.7 3.7a.8.8 0 0 1-1.2 0L7.7 8.4a1.5 1.5 0 0 0-2.1 0Z" />
    </svg>
  );
}

function PayBtn({ label, icon, active, onClick }: {
  label: string; icon: React.ReactNode; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      style={{
        flex: 1, minHeight: 62, borderRadius: 10, cursor: 'pointer',
        border: `1.5px solid ${active ? 'var(--primary)' : 'var(--hairline)'}`,
        background: active ? 'rgba(193,117,11,0.07)' : 'var(--surface)',
        color: active ? 'var(--primary)' : 'var(--ink-mute)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 4, fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400,
        fontSize: 12, transition: 'all 160ms', padding: '8px 4px',
      }}
    >
      <span style={{ lineHeight: 1 }}>{icon}</span>
      {label}
    </button>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function Cotacao() {
  const [lensPrices,   setLensPrices]   = useState<Record<string, string>>({});
  const [treatPrices,  setTreatPrices]  = useState<Record<string, string>>({});
  const [selectedLens, setSelectedLens] = useState<LensId | null>(null);
  const [activeTreats, setActiveTreats] = useState<TreatId[]>([]);
  const [payMethod,    setPayMethod]    = useState<PayMethod | null>(null);
  const [cashDiscount, setCashDiscount] = useState('');
  const [parcelas,     setParcelas]     = useState(1);
  const [customFee,    setCustomFee]    = useState('');
  const [lightbox,     setLightbox]     = useState<{ src: string; alt: string } | null>(null);

  function togglePay(m: PayMethod) { setPayMethod(payMethod === m ? null : m); }
  function updateLensPrice(id: string, v: string)  { setLensPrices(p  => ({ ...p,  [id]: v })); }
  function updateTreatPrice(id: string, v: string) { setTreatPrices(p => ({ ...p,  [id]: v })); }
  function toggleTreat(id: TreatId) {
    setActiveTreats(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  }
  function selectParcelas(n: number) {
    setParcelas(n);
    setCustomFee(n > 5 ? String(FEES[n].toFixed(2)) : '');
  }
  function handleReset() {
    setLensPrices({}); setTreatPrices({});
    setSelectedLens(null); setActiveTreats([]);
    setPayMethod(null); setCashDiscount('');
    setParcelas(1); setCustomFee('');
  }

  const lensPrice  = parseVal(lensPrices[selectedLens ?? ''] ?? '');
  const treatTotal = activeTreats.reduce((s, id) => s + parseVal(treatPrices[id] ?? ''), 0);
  const subtotal   = lensPrice + treatTotal;

  const discountRate = parseVal(cashDiscount) / 100;
  const vistaTotal   = discountRate > 0 ? subtotal * (1 - discountRate) : subtotal;

  const feeRate     = parcelas > 5 && customFee !== '' ? parseVal(customFee) / 100 : 0;
  const creditTotal = subtotal * (1 + feeRate);
  const parcelValue = parcelas > 0 ? creditTotal / parcelas : 0;

  const hasSomething = subtotal > 0;
  const lens = LENSES.find(l => l.id === selectedLens);

  return (
    <>
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}

      <div className="page-header">
        <div>
          <h1 className="dash-hello">Simulador de <em>Lentes</em></h1>
          <p className="dash-sub">Cotação no balcão · preencha os valores na hora.</p>
        </div>
        <button className="btn-touch btn-ghost-atelier"
          style={{ minHeight: 44, padding: '0 18px', fontSize: 13 }}
          onClick={handleReset}>
          Limpar
        </button>
      </div>

      {/* ── 01 · Tipo de lente ──────────────────────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>
          <span className="eyebrow-num">01</span>
          <span className="eyebrow">Tipo de lente</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {LENSES.map(l => (
            <LensCard
              key={l.id} lens={l}
              selected={selectedLens === l.id}
              price={lensPrices[l.id] ?? ''}
              onSelect={() => setSelectedLens(selectedLens === l.id ? null : l.id)}
              onPrice={v => updateLensPrice(l.id, v)}
              onViewImg={(src, alt) => setLightbox({ src, alt })}
            />
          ))}
        </div>
      </section>

      {/* ── 02 · Tratamentos ────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 32 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>
          <span className="eyebrow-num">02</span>
          <span className="eyebrow">Tratamentos</span>
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-card)', border: '1px solid var(--hairline)', overflow: 'hidden' }}>
          {TREATMENTS.map((t, i) => (
            <div key={t.id} style={{ borderTop: i > 0 ? '1px solid var(--hairline)' : 'none' }}>
              <TreatRow
                treat={t}
                active={activeTreats.includes(t.id)}
                price={treatPrices[t.id] ?? ''}
                onToggle={() => toggleTreat(t.id)}
                onPrice={v => updateTreatPrice(t.id, v)}
                onViewImg={(src, alt) => setLightbox({ src, alt })}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 · Forma de pagamento ──────────────────────────────────────────── */}
      <section style={{ marginBottom: 40 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>
          <span className="eyebrow-num">03</span>
          <span className="eyebrow">Forma de pagamento</span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <PayBtn label="PIX"      icon={<PixIcon />}                              active={payMethod === 'pix'}      onClick={() => togglePay('pix')}      />
          <PayBtn label="Dinheiro" icon={<span style={{ fontSize: 20 }}>💵</span>} active={payMethod === 'dinheiro'} onClick={() => togglePay('dinheiro')} />
          <PayBtn label="Débito"   icon={<span style={{ fontSize: 20 }}>💳</span>} active={payMethod === 'debito'}   onClick={() => togglePay('debito')}   />
          <PayBtn label="Crédito"  icon={<span style={{ fontSize: 20 }}>💳</span>} active={payMethod === 'credito'}  onClick={() => togglePay('credito')}  />
        </div>

        {/* PIX / Dinheiro */}
        {(payMethod === 'pix' || payMethod === 'dinheiro') && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-card)', padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Desconto à vista</span>
              <input
                type="number" min={0} max={100} step={0.5}
                value={cashDiscount} placeholder="0"
                onChange={e => setCashDiscount(e.target.value)}
                style={{
                  width: 64, textAlign: 'right', border: 'none',
                  borderBottom: '1px solid var(--hairline)',
                  background: 'transparent', fontSize: 16, fontWeight: 600,
                  color: 'var(--primary)', padding: '2px 0', outline: 'none', fontFamily: 'var(--font-body)',
                }}
              />
              <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>%</span>
              {cashDiscount !== '' && cashDiscount !== '0' && (
                <button onClick={() => setCashDiscount('')}
                  style={{ fontSize: 11, color: 'var(--ink-mute)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  limpar
                </button>
              )}
            </div>
            {hasSomething && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  {discountRate > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginBottom: 2 }}>
                      {payMethod === 'pix' ? 'PIX' : 'Dinheiro'} com {cashDiscount}% de desconto
                    </div>
                  )}
                  <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {fmt(vistaTotal)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>subtotal</div>
                  <div style={{ fontSize: 18, fontWeight: 500 }}>{fmt(subtotal)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Débito */}
        {payMethod === 'debito' && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-card)', padding: '16px 18px', marginBottom: 16 }}>
            {hasSomething ? (
              <div>
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginBottom: 2 }}>Débito · à vista</div>
                <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{fmt(subtotal)}</div>
              </div>
            ) : (
              <div style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Selecione a lente e tratamentos para ver o total.</div>
            )}
          </div>
        )}

        {/* Crédito */}
        {payMethod === 'credito' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 12 }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
                const sel = parcelas === n;
                return (
                  <button key={n} onClick={() => selectParcelas(n)} aria-pressed={sel}
                    style={{
                      minHeight: 52, borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--hairline)'}`,
                      background: sel ? 'var(--primary)' : 'var(--surface)',
                      color: sel ? 'white' : (n > 5 ? 'var(--ink-mute)' : 'var(--ink)'),
                      fontWeight: sel ? 700 : 400, fontSize: 16,
                      fontFamily: 'var(--font-body)', transition: 'all 140ms',
                    }}>
                    {n}×
                  </button>
                );
              })}
            </div>

            {parcelas <= 5 ? (
              <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: 'rgba(99,132,117,0.07)', color: 'var(--secondary)', fontSize: 13 }}>
                {parcelas}× sem juros
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 8, marginBottom: 14,
                background: feeRate > 0 ? 'rgba(176,125,26,0.07)' : 'rgba(99,132,117,0.07)',
                border: `1px solid ${feeRate > 0 ? 'rgba(176,125,26,0.18)' : 'var(--hairline)'}`,
              }}>
                <span style={{ fontSize: 13, color: 'var(--ink-mute)', flexShrink: 0 }}>Taxa {parcelas}×</span>
                <input
                  type="number" min={0} max={50} step={0.01}
                  value={customFee} placeholder={String(FEES[parcelas])}
                  onChange={e => setCustomFee(e.target.value)}
                  style={{
                    width: 90, textAlign: 'right', border: 'none',
                    borderBottom: `1px solid ${feeRate > 0 ? 'var(--warning)' : 'var(--hairline)'}`,
                    background: 'transparent', fontSize: 16, fontWeight: 600,
                    color: feeRate > 0 ? 'var(--warning)' : 'var(--ink-mute)',
                    padding: '2px 0', outline: 'none', fontFamily: 'var(--font-body)',
                  }}
                />
                <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>%</span>
                {customFee === '' ? (
                  <span style={{ fontSize: 12, color: 'var(--secondary)', background: 'rgba(99,132,117,0.12)', borderRadius: 20, padding: '2px 10px', marginLeft: 'auto' }}>
                    sem juros
                  </span>
                ) : (
                  <button onClick={() => setCustomFee('')}
                    style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-mute)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>
                    limpar
                  </button>
                )}
              </div>
            )}

            <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
              {selectedLens && (
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--hairline)' }}>
                  {lens && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-soft)', marginBottom: 5 }}>
                      <span>Lente {lens.name}</span>
                      <span style={{ fontWeight: 500 }}>{fmt(lensPrice)}</span>
                    </div>
                  )}
                  {activeTreats.map(id => {
                    const t = TREATMENTS.find(x => x.id === id)!;
                    return (
                      <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-soft)', marginBottom: 5 }}>
                        <span>+ {t.name}</span>
                        <span style={{ fontWeight: 500 }}>{fmt(parseVal(treatPrices[id] ?? ''))}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ padding: '18px 18px' }}>
                {!hasSomething ? (
                  <div style={{ textAlign: 'center', color: 'var(--ink-mute)', fontSize: 14 }}>
                    Selecione a lente e tratamentos para ver o total.
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {parcelas === 1 ? '1× à prazo' : feeRate > 0 ? `${parcelas}× com juros (+${(feeRate * 100).toFixed(2)}%)` : `${parcelas}× sem juros`}
                      </div>
                      <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{fmt(parcelValue)}</div>
                      {parcelas > 1 && <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 5 }}>total: {fmt(creditTotal)}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>subtotal</div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink-soft)' }}>{fmt(subtotal)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!payMethod && hasSomething && (
          <div style={{ padding: '16px 18px', borderRadius: 'var(--r-card)', border: '1px dashed var(--hairline)', textAlign: 'center', color: 'var(--ink-mute)', fontSize: 14 }}>
            Subtotal: <strong style={{ color: 'var(--ink)' }}>{fmt(subtotal)}</strong> · Selecione a forma de pagamento acima.
          </div>
        )}
      </section>
    </>
  );
}
