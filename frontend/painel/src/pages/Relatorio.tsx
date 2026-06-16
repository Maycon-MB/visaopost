import { useCallback, useEffect, useState } from 'react';
import { fetchMonthlyReport, generateReportInsights } from '../api.js';

const MONTH_PT = ['', 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function today() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function prevMonth(y, m) { return m === 1  ? { year: y - 1, month: 12 } : { year: y, month: m - 1 }; }
function nextMonth(y, m) { return m === 12 ? { year: y + 1, month: 1  } : { year: y, month: m + 1 }; }

function Stat({ label, value, sub, accent }) {
  return (
    <div className="rpt-stat">
      <div className="rpt-stat-val" style={accent ? { color: 'var(--primary)' } : {}}>{value}</div>
      <div className="rpt-stat-lbl">{label}</div>
      {sub && <div className="rpt-stat-sub">{sub}</div>}
    </div>
  );
}

function ChevronIcon({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}/>
    </svg>
  );
}

export default function Relatorio() {
  const now              = today();
  const [year,  setYear]  = useState(now.year);
  const [month, setMonth] = useState(now.month);
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [insLoading, setInsLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const load = useCallback(async (y, m) => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const data = await fetchMonthlyReport(y, m);
      setReport(data);
    } catch (e) {
      setError(e.message || 'Erro ao carregar relatório.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(year, month); }, [year, month, load]);

  const goBack = () => {
    const p = prevMonth(year, month);
    setYear(p.year); setMonth(p.month);
  };
  const goNext = () => {
    const n = nextMonth(year, month);
    if (n.year > now.year || (n.year === now.year && n.month > now.month)) return;
    setYear(n.year); setMonth(n.month);
  };
  const isFuture = year > now.year || (year === now.year && month >= now.month);

  const handleInsights = async () => {
    setInsLoading(true);
    try {
      const updated = await generateReportInsights(year, month);
      setReport(updated);
    } catch (e) {
      alert(e.message || 'Erro ao gerar insights.');
    } finally {
      setInsLoading(false);
    }
  };

  return (
    <div className="page-wrap enter">
      <style>{`
        /* ── header ── */
        .rpt-nav {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem;
        }
        .rpt-month-ctrl {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .rpt-arrow {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--surface); border: 1px solid var(--hairline-strong);
          color: var(--ink-mute); cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .rpt-arrow:hover:not(:disabled) { background: var(--primary); color: #fff; border-color: var(--primary); }
        .rpt-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        .rpt-month-lbl {
          font-size: 18px; font-weight: 600; color: var(--ink);
          min-width: 160px; text-align: center;
        }

        /* ── grid ── */
        .rpt-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        @media (min-width: 700px) {
          .rpt-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .rpt-card {
          background: var(--surface); border: 1px solid var(--hairline);
          border-radius: var(--r-card); padding: 1.25rem 1rem;
        }
        .rpt-card-title {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--primary);
          margin-bottom: 1rem; display: flex; align-items: center; gap: 6px;
        }
        .rpt-card-wide { grid-column: 1 / -1; }

        /* ── stat ── */
        .rpt-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .rpt-stat { flex: 1; min-width: 80px; }
        .rpt-stat-val { font-size: 28px; font-weight: 700; line-height: 1; color: var(--ink); }
        .rpt-stat-lbl { font-size: 12px; color: var(--ink-mute); margin-top: 3px; }
        .rpt-stat-sub { font-size: 11px; color: var(--ink-mute); opacity: 0.7; margin-top: 1px; }

        /* ── themes ── */
        .rpt-themes { display: flex; flex-direction: column; gap: 6px; }
        .rpt-theme-row { display: flex; align-items: center; gap: 8px; }
        .rpt-theme-bar-wrap {
          flex: 1; height: 6px; border-radius: 3px;
          background: var(--hairline);
        }
        .rpt-theme-bar {
          height: 100%; border-radius: 3px;
          background: var(--primary); transition: width 0.6s ease;
        }
        .rpt-theme-name { font-size: 12px; color: var(--ink-mute); min-width: 90px; }
        .rpt-theme-count { font-size: 12px; font-weight: 600; color: var(--ink); min-width: 16px; text-align: right; }

        /* ── approval ring ── */
        .rpt-approval { display: flex; align-items: center; gap: 1.25rem; }
        .rpt-ring { flex-shrink: 0; }
        .rpt-ring-bg  { stroke: var(--hairline); }
        .rpt-ring-fg  { stroke: var(--primary); stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
        .rpt-ring-pct { font-size: 15px; font-weight: 700; fill: var(--ink); }
        .rpt-ring-lbl { font-size: 9px; fill: var(--ink-mute); }
        .rpt-aprov-stats { display: flex; flex-direction: column; gap: 6px; }
        .rpt-aprov-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-mute); }
        .rpt-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* ── insights ── */
        .rpt-insights-card {
          background: var(--surface); border: 1px solid var(--hairline);
          border-radius: var(--r-card); padding: 1.25rem;
          grid-column: 1 / -1;
        }
        .rpt-insights-text {
          font-size: 14px; line-height: 1.8; color: var(--ink-soft, var(--ink));
          white-space: pre-line; margin-top: 0.75rem;
        }
        .rpt-insights-btn {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 0.75rem; padding: 0.5rem 1rem;
          background: var(--ivory); border: 1px solid var(--hairline-strong);
          border-radius: 8px; font-family: inherit; font-size: 13px;
          color: var(--ink-mute); cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .rpt-insights-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
        .rpt-insights-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rpt-spinner {
          width: 13px; height: 13px; border: 2px solid currentColor;
          border-top-color: transparent; border-radius: 50%;
          animation: rpt-spin 0.7s linear infinite;
        }
        @keyframes rpt-spin { to { transform: rotate(360deg); } }

        /* ── states ── */
        .rpt-loading { padding: 4rem; text-align: center; color: var(--ink-mute); font-style: italic; font-size: 14px; }
        .rpt-error   { padding: 3rem; text-align: center; color: var(--danger); font-size: 14px; }
        .rpt-empty   { font-size: 13px; color: var(--ink-mute); font-style: italic; }
      `}</style>

      <div className="rpt-nav">
        <h1 className="page-title" style={{ margin: 0 }}>Relatório Mensal</h1>
        <div className="rpt-month-ctrl">
          <button className="rpt-arrow" onClick={goBack} disabled={loading} title="Mês anterior">
            <ChevronIcon dir="left"/>
          </button>
          <span className="rpt-month-lbl">{MONTH_PT[month]} {year}</span>
          <button className="rpt-arrow" onClick={goNext} disabled={loading || isFuture} title="Próximo mês">
            <ChevronIcon dir="right"/>
          </button>
        </div>
      </div>

      {loading && <div className="rpt-loading">Carregando dados do mês…</div>}
      {error   && <div className="rpt-error">{error}</div>}

      {report && !loading && (() => {
        const maxTheme = report.top_themes[0]?.count || 1;
        const circ = 2 * Math.PI * 26; // r=26
        const offset = circ - (report.posts_approval_rate / 100) * circ;

        return (
          <div className="rpt-grid">

            {/* ── Conteúdo ── */}
            <div className="rpt-card">
              <div className="rpt-card-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 9H3M15 15H3"/>
                </svg>
                Conteúdo
              </div>
              <div className="rpt-stats">
                <Stat label="publicados" value={report.posts_published} accent/>
                <Stat label="no período" value={report.posts_total_month}/>
              </div>
            </div>

            {/* ── Aprovação ── */}
            <div className="rpt-card">
              <div className="rpt-card-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>
                </svg>
                Aprovação
              </div>
              <div className="rpt-approval">
                <svg className="rpt-ring" width="64" height="64" viewBox="0 0 64 64">
                  <circle className="rpt-ring-bg" cx="32" cy="32" r="26" fill="none" strokeWidth="5"/>
                  <circle className="rpt-ring-fg" cx="32" cy="32" r="26" fill="none" strokeWidth="5"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    transform="rotate(-90 32 32)"/>
                  <text className="rpt-ring-pct" x="32" y="36" textAnchor="middle">
                    {report.posts_approval_rate}%
                  </text>
                </svg>
                <div className="rpt-aprov-stats">
                  <div className="rpt-aprov-row">
                    <span className="rpt-dot" style={{ background: 'var(--primary)' }}/>
                    {report.posts_published} aprovados
                  </div>
                  <div className="rpt-aprov-row">
                    <span className="rpt-dot" style={{ background: 'var(--danger)' }}/>
                    {report.posts_total_month - report.posts_published} outros
                  </div>
                </div>
              </div>
            </div>

            {/* ── Clientes ── */}
            <div className="rpt-card">
              <div className="rpt-card-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Clientes
              </div>
              <div className="rpt-stats">
                <Stat label="base ativa" value={report.clients_total_active}/>
                <Stat label="novos no mês" value={report.clients_new_month} accent/>
              </div>
            </div>

            {/* ── Recall ── */}
            <div className="rpt-card">
              <div className="rpt-card-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 16 16.73l.99-.99a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Recall
              </div>
              <div className="rpt-stats">
                <Stat label="contactados" value={report.clients_contacted_month} accent/>
                <Stat label="via QR balcão" value={report.clients_from_qr_month}/>
              </div>
            </div>

            {/* ── Temas ── */}
            {report.top_themes.length > 0 && (
              <div className="rpt-card rpt-card-wide">
                <div className="rpt-card-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  Temas mais publicados
                </div>
                <div className="rpt-themes">
                  {report.top_themes.map(t => (
                    <div key={t.theme} className="rpt-theme-row">
                      <span className="rpt-theme-name">{t.theme.replace(/_/g, ' ')}</span>
                      <div className="rpt-theme-bar-wrap">
                        <div className="rpt-theme-bar" style={{ width: `${(t.count / maxTheme) * 100}%` }}/>
                      </div>
                      <span className="rpt-theme-count">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Insights IA ── */}
            <div className="rpt-insights-card">
              <div className="rpt-card-title" style={{ marginBottom: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                Insights do mês
              </div>

              {report.insights
                ? <p className="rpt-insights-text">{report.insights}</p>
                : <p className="rpt-empty" style={{ marginTop: '0.75rem' }}>Clique em "Gerar insights" para análise automática.</p>
              }

              <button className="rpt-insights-btn" onClick={handleInsights} disabled={insLoading}>
                {insLoading
                  ? <><div className="rpt-spinner"/> Gerando…</>
                  : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    {report.insights ? 'Atualizar insights' : 'Gerar insights'}
                  </>
                }
              </button>
            </div>

          </div>
        );
      })()}
    </div>
  );
}
