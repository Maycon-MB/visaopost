import { useCallback, useEffect, useRef, useState } from 'react';
import { generateReel, listReels, deleteReel } from '../api.js';

/* ─── helpers ─────────────────────────────────────────── */
const TOM_LABEL  = { autoridade: 'Autoridade', educativo: 'Educativo', promo: 'Promoção' };
const TOM_DESC   = { autoridade: 'Especialista, técnico, confiante', educativo: '3 dicas, "você sabia", informativo', promo: 'Destaque de produto ou serviço' };
const DUR_LABEL  = { 15: '15 s', 30: '30 s', 60: '60 s' };

function Icon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d}/>
    </svg>
  );
}

function CopyBtn({ text, label = 'Copiar' }) {
  const [done, setDone] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  }, [text]);
  return (
    <button className="reel-copy-btn" onClick={copy} title="Copiar para área de transferência">
      {done
        ? <><Icon d="M20 6L9 17l-5-5" size={14}/> Copiado!</>
        : <><Icon d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" size={14}/> {label}</>
      }
    </button>
  );
}

function ScriptCard({ script, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(script.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <div className="reel-history-card">
      <div className="rhc-head" onClick={() => setExpanded(v => !v)}>
        <span className="reel-tom-pill" data-tom={script.tom}>{TOM_LABEL[script.tom]}</span>
        <span className="rhc-dur">{DUR_LABEL[script.duracao_s] || `${script.duracao_s}s`}</span>
        <span className="rhc-tema">{script.tema}</span>
        <span className="rhc-date">{date}</span>
        <button className="rhc-expand" aria-label={expanded ? 'Recolher' : 'Expandir'}>
          <Icon d={expanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={14}/>
        </button>
      </div>

      {expanded && (
        <div className="rhc-body">
          <div className="reel-field-sm">
            <span className="reel-field-lbl">Hook</span>
            <p className="reel-field-val">{script.hook}</p>
            <CopyBtn text={script.hook} label="Copiar hook"/>
          </div>
          <div className="reel-field-sm">
            <span className="reel-field-lbl">Roteiro</span>
            <pre className="reel-roteiro-pre">{script.roteiro}</pre>
            <CopyBtn text={script.roteiro} label="Copiar roteiro"/>
          </div>
          <div className="reel-field-sm">
            <span className="reel-field-lbl">Legenda</span>
            <p className="reel-field-val">{script.legenda}</p>
            <CopyBtn text={script.legenda} label="Copiar legenda"/>
          </div>
          <div className="reel-field-sm">
            <span className="reel-field-lbl">Hashtags</span>
            <div className="reel-hash-pills">
              {script.hashtags.map(h => <span key={h} className="reel-hash-pill">#{h}</span>)}
            </div>
            <CopyBtn text={script.hashtags.map(h => `#${h}`).join(' ')} label="Copiar hashtags"/>
          </div>
          <div className="reel-field-row">
            <div className="reel-field-sm">
              <span className="reel-field-lbl">CTA verbal</span>
              <p className="reel-field-val">{script.cta_verbal}</p>
            </div>
            <div className="reel-field-sm">
              <span className="reel-field-lbl">CTA legenda</span>
              <p className="reel-field-val">{script.cta_legenda}</p>
            </div>
          </div>
          <div className="rhc-actions">
            <button className="btn-touch reel-del-btn" onClick={() => onDelete(script.id)} title="Excluir roteiro">
              <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" size={14}/> Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── main ─────────────────────────────────────────────── */
export default function Reels() {
  const [tema,     setTema]     = useState('');
  const [produto,  setProduto]  = useState('');
  const [duracao,  setDuracao]  = useState(30);
  const [tom,      setTom]      = useState('autoridade');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [result,   setResult]   = useState(null);
  const [history,  setHistory]  = useState([]);
  const [histLoad, setHistLoad] = useState(true);
  const resultRef = useRef(null);

  useEffect(() => {
    listReels()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setHistLoad(false));
  }, []);

  const handleGenerate = useCallback(async (e) => {
    e.preventDefault();
    if (!tema.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const script = await generateReel({
        tema: tema.trim(),
        produto: produto.trim() || null,
        duracao_s: duracao,
        tom,
      });
      setResult(script);
      setHistory(h => [script, ...h]);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (err) {
      setError(err.message || 'Erro ao gerar roteiro.');
    } finally {
      setLoading(false);
    }
  }, [tema, produto, duracao, tom]);

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Excluir este roteiro?')) return;
    try {
      await deleteReel(id);
      setHistory(h => h.filter(s => s.id !== id));
      if (result?.id === id) setResult(null);
    } catch {}
  }, [result]);

  return (
    <div className="page-wrap enter">
      <style>{`
        /* ─── page layout ─── */
        .reels-layout { display: flex; flex-direction: column; gap: 1.5rem; }
        @media (min-width: 900px) {
          .reels-layout { flex-direction: row; align-items: flex-start; }
          .reels-form-col { flex: 0 0 340px; position: sticky; top: 80px; }
          .reels-result-col { flex: 1; min-width: 0; }
        }

        /* ─── form card ─── */
        .reels-form-card {
          background: var(--surface);
          border: 1px solid var(--hairline);
          border-radius: var(--r-card);
          padding: 1.5rem;
        }
        .reels-form-title {
          font-size: 15px; font-weight: 600;
          color: var(--ink); margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 8px;
        }
        .reels-form-title svg { color: var(--primary); }

        .reel-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 1rem; }
        .reel-label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-mute); }
        .reel-input {
          border: 1px solid var(--hairline-strong);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          font-family: inherit; font-size: 14px;
          background: var(--ivory); color: var(--ink);
          transition: border-color 0.15s;
          width: 100%;
        }
        .reel-input:focus { outline: none; border-color: var(--primary); }
        .reel-input::placeholder { color: var(--ink-mute); opacity: 0.55; }

        /* tom selector */
        .reel-tom-grid { display: flex; flex-direction: column; gap: 6px; }
        .reel-tom-opt {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 0.6rem 0.75rem; border-radius: 8px; cursor: pointer;
          border: 1.5px solid var(--hairline-strong);
          background: var(--ivory); transition: border-color 0.15s, background 0.15s;
        }
        .reel-tom-opt.selected { border-color: var(--primary); background: rgba(193,117,11,0.06); }
        .reel-tom-opt input[type=radio] { display: none; }
        .reel-tom-info { flex: 1; }
        .reel-tom-name { font-size: 13px; font-weight: 600; color: var(--ink); }
        .reel-tom-sub  { font-size: 11px; color: var(--ink-mute); margin-top: 1px; }

        /* dur tabs */
        .reel-dur-tabs { display: flex; gap: 6px; }
        .reel-dur-tab {
          flex: 1; padding: 0.45rem 0; text-align: center;
          border: 1.5px solid var(--hairline-strong);
          border-radius: 8px; font-size: 13px; font-weight: 500;
          background: var(--ivory); color: var(--ink-mute); cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .reel-dur-tab.active { border-color: var(--primary); color: var(--primary); background: rgba(193,117,11,0.06); font-weight: 700; }

        .reel-gen-btn {
          width: 100%; margin-top: 0.25rem;
          padding: 0.8rem;
          background: var(--primary); color: #fff;
          border: none; border-radius: 10px;
          font-family: inherit; font-size: 14px; font-weight: 600;
          letter-spacing: 0.04em; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s;
        }
        .reel-gen-btn:hover { background: var(--ochre-deep, #9A5C08); }
        .reel-gen-btn:active { transform: scale(0.98); }
        .reel-gen-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .reel-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .reel-form-error { margin-top: 0.75rem; font-size: 13px; color: var(--danger); text-align: center; }

        /* ─── result card ─── */
        .reels-result-card {
          background: var(--surface);
          border: 1px solid var(--primary);
          border-radius: var(--r-card);
          padding: 1.5rem;
          animation: fadeSlideUp 0.4s ease;
        }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .reel-result-head {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .reel-result-title { font-size: 15px; font-weight: 700; color: var(--ink); flex: 1; min-width: 0; }
        .reel-result-meta { font-size: 12px; color: var(--ink-mute); }

        .reel-section {
          border-top: 1px solid var(--hairline);
          padding-top: 1rem; margin-top: 1rem;
        }
        .reel-section-lbl {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem;
        }
        .reel-hook-text {
          font-size: 17px; font-weight: 500; font-style: italic;
          line-height: 1.5; color: var(--ink);
        }
        .reel-roteiro-pre {
          font-family: inherit; font-size: 14px; line-height: 1.8;
          white-space: pre-wrap; color: var(--ink-soft, var(--ink));
          max-height: 260px; overflow-y: auto;
          background: var(--ivory); border-radius: 8px;
          padding: 0.75rem 1rem; margin-bottom: 0.5rem;
        }
        .reel-legenda-text {
          font-size: 14px; line-height: 1.7; color: var(--ink-soft, var(--ink));
          white-space: pre-wrap; margin-bottom: 0.5rem;
        }
        .reel-hash-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 0.5rem; }
        .reel-hash-pill {
          font-size: 11px; font-weight: 500; padding: 3px 8px;
          border-radius: 50px; background: var(--ivory-soft, var(--ivory));
          border: 1px solid var(--hairline-strong); color: var(--ink-mute);
        }
        .reel-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .reel-cta-box {
          flex: 1; min-width: 200px; padding: 0.75rem 1rem;
          background: var(--ivory); border-radius: 8px;
          border: 1px solid var(--hairline);
        }
        .reel-cta-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-mute); margin-bottom: 3px; }
        .reel-cta-val { font-size: 13px; color: var(--ink); font-style: italic; }

        /* ─── copy btn ─── */
        .reel-copy-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: inherit; font-size: 12px; font-weight: 500;
          padding: 0.3rem 0.75rem; border-radius: 6px;
          background: var(--ivory); border: 1px solid var(--hairline-strong);
          color: var(--ink-mute); cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .reel-copy-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }

        /* ─── empty result ─── */
        .reels-empty {
          background: var(--surface); border: 1px dashed var(--hairline-strong);
          border-radius: var(--r-card); padding: 3rem 1.5rem;
          text-align: center; color: var(--ink-mute);
        }
        .reels-empty-icon { opacity: 0.2; margin-bottom: 1rem; color: var(--primary); }
        .reels-empty-title { font-size: 15px; font-weight: 500; font-style: italic; color: var(--ink-mute); }
        .reels-empty-sub { font-size: 13px; margin-top: 4px; }

        /* ─── history ─── */
        .reel-history-section { margin-top: 2rem; }
        .reel-history-title {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--ink-mute); margin-bottom: 0.75rem;
        }
        .reel-history-list { display: flex; flex-direction: column; gap: 6px; }
        .reel-history-card {
          background: var(--surface); border: 1px solid var(--hairline);
          border-radius: 10px; overflow: hidden; transition: border-color 0.15s;
        }
        .reel-history-card:hover { border-color: var(--hairline-strong); }
        .rhc-head {
          display: flex; align-items: center; gap: 8px; padding: 0.7rem 1rem;
          cursor: pointer; flex-wrap: wrap;
        }
        .reel-tom-pill {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; padding: 2px 7px; border-radius: 4px; flex-shrink: 0;
        }
        .reel-tom-pill[data-tom="autoridade"] { background: rgba(193,117,11,0.12); color: var(--primary); }
        .reel-tom-pill[data-tom="educativo"]  { background: rgba(99,132,117,0.12);  color: var(--sage, #638475); }
        .reel-tom-pill[data-tom="promo"]      { background: rgba(148,28,47,0.1);    color: var(--burgundy, #941C2F); }
        .rhc-dur  { font-size: 11px; color: var(--ink-mute); flex-shrink: 0; }
        .rhc-tema { flex: 1; font-size: 13px; font-weight: 500; color: var(--ink); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rhc-date { font-size: 11px; color: var(--ink-mute); flex-shrink: 0; }
        .rhc-expand { background: none; border: none; cursor: pointer; color: var(--ink-mute); padding: 0; display: flex; }

        .rhc-body { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .reel-field-sm { display: flex; flex-direction: column; gap: 4px; }
        .reel-field-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-mute); }
        .reel-field-val { font-size: 13px; color: var(--ink); line-height: 1.5; }
        .reel-field-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .reel-field-row > * { flex: 1; min-width: 150px; }
        .rhc-actions { display: flex; justify-content: flex-end; padding-top: 0.25rem; }
        .reel-del-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; padding: 0.3rem 0.75rem; border-radius: 6px;
          background: none; border: 1px solid var(--hairline-strong); color: var(--ink-mute);
          cursor: pointer; font-family: inherit; transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .reel-del-btn:hover { background: rgba(148,28,47,0.08); color: var(--danger); border-color: var(--danger); }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Reels de Autoridade</h1>
        <p className="page-subtitle">Gere roteiros prontos para gravar. Autoridade, educativo ou promoção.</p>
      </div>

      <div className="reels-layout">
        {/* ── form ── */}
        <div className="reels-form-col">
          <div className="reels-form-card">
            <div className="reels-form-title">
              <Icon d="M15 10l4.553-2.069A1 1 0 0 1 21 8.869V15.13a1 1 0 0 1-1.447.9L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={16}/>
              Novo roteiro
            </div>

            <form onSubmit={handleGenerate} noValidate>
              <div className="reel-field">
                <label className="reel-label" htmlFor="reel-tema">Tema do Reel *</label>
                <input
                  id="reel-tema" className="reel-input"
                  value={tema} onChange={e => setTema(e.target.value)}
                  placeholder='Ex: "Como escolher lente progressiva"'
                  maxLength={200} required
                />
              </div>

              <div className="reel-field">
                <label className="reel-label" htmlFor="reel-produto">Produto em destaque <span style={{ opacity: 0.55, fontWeight: 400 }}>(opcional)</span></label>
                <input
                  id="reel-produto" className="reel-input"
                  value={produto} onChange={e => setProduto(e.target.value)}
                  placeholder='Ex: "Lente Transitions", "Armação Ray-Ban"'
                  maxLength={200}
                />
              </div>

              <div className="reel-field">
                <span className="reel-label">Duração</span>
                <div className="reel-dur-tabs">
                  {[15, 30, 60].map(d => (
                    <button key={d} type="button"
                      className={`reel-dur-tab ${duracao === d ? 'active' : ''}`}
                      onClick={() => setDuracao(d)}>
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="reel-field">
                <span className="reel-label">Tom</span>
                <div className="reel-tom-grid">
                  {['autoridade', 'educativo', 'promo'].map(t => (
                    <label key={t} className={`reel-tom-opt ${tom === t ? 'selected' : ''}`}>
                      <input type="radio" name="tom" value={t} checked={tom === t} onChange={() => setTom(t)}/>
                      <div className="reel-tom-info">
                        <div className="reel-tom-name">{TOM_LABEL[t]}</div>
                        <div className="reel-tom-sub">{TOM_DESC[t]}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button className="reel-gen-btn" disabled={loading || !tema.trim()} type="submit">
                {loading
                  ? <><div className="reel-spinner"/> Gerando…</>
                  : <><Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" size={16}/> Gerar Roteiro</>
                }
              </button>
              {error && <p className="reel-form-error">{error}</p>}
            </form>
          </div>
        </div>

        {/* ── result ── */}
        <div className="reels-result-col">
          {result ? (
            <div className="reels-result-card" ref={resultRef}>
              <div className="reel-result-head">
                <span className="reel-tom-pill" data-tom={result.tom}>{TOM_LABEL[result.tom]}</span>
                <span className="reel-result-title">{result.tema}</span>
                <span className="reel-result-meta">{DUR_LABEL[result.duracao_s]}</span>
              </div>

              <div className="reel-section">
                <div className="reel-section-lbl">Hook</div>
                <p className="reel-hook-text">"{result.hook}"</p>
                <div style={{ marginTop: 8 }}><CopyBtn text={result.hook} label="Copiar hook"/></div>
              </div>

              <div className="reel-section">
                <div className="reel-section-lbl">Roteiro completo</div>
                <pre className="reel-roteiro-pre">{result.roteiro}</pre>
                <CopyBtn text={result.roteiro} label="Copiar roteiro"/>
              </div>

              <div className="reel-section">
                <div className="reel-section-lbl">Legenda Instagram</div>
                <p className="reel-legenda-text">{result.legenda}</p>
                <CopyBtn text={result.legenda} label="Copiar legenda"/>
              </div>

              <div className="reel-section">
                <div className="reel-section-lbl">Hashtags</div>
                <div className="reel-hash-pills">
                  {result.hashtags.map(h => <span key={h} className="reel-hash-pill">#{h}</span>)}
                </div>
                <div style={{ marginTop: 8 }}>
                  <CopyBtn text={result.hashtags.map(h => `#${h}`).join(' ')} label="Copiar todas"/>
                </div>
              </div>

              <div className="reel-section">
                <div className="reel-section-lbl">CTA</div>
                <div className="reel-cta-row">
                  <div className="reel-cta-box">
                    <div className="reel-cta-lbl">Verbal (no vídeo)</div>
                    <p className="reel-cta-val">"{result.cta_verbal}"</p>
                  </div>
                  <div className="reel-cta-box">
                    <div className="reel-cta-lbl">Legenda</div>
                    <p className="reel-cta-val">"{result.cta_legenda}"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="reels-empty">
              <svg className="reels-empty-icon" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="3"/>
                <path d="M10 8l6 4-6 4V8z"/>
              </svg>
              <p className="reels-empty-title">Preencha o tema e gere o primeiro roteiro.</p>
              <p className="reels-empty-sub">O roteiro aparece aqui em segundos.</p>
            </div>
          )}

          {/* ── history ── */}
          {!histLoad && history.length > 0 && (
            <div className="reel-history-section">
              <div className="reel-history-title">Histórico ({history.length})</div>
              <div className="reel-history-list">
                {history.map(s => (
                  <ScriptCard key={s.id} script={s} onDelete={handleDelete}/>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
