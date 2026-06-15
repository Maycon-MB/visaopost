import { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react/lib/core';
import echarts from '../charts/echartsCore.js';
import { baseChart, lineSeries, axisLine, axisValue, TOKENS, FONT, IT_PALETTE, fmtNum, refreshTokens } from '../charts/theme.js';
import { useTheme } from '../theme-context.jsx';

function InfoButton({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        className={`info-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 140)}
        aria-label="O que esse gráfico mostra?"
      >i</button>
      {open && <div className="info-pop">{text}</div>}
    </span>
  );
}

const MES_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Ícones de traço (sem emoji). currentColor, 24x24.
function Icon({ paths }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}
function CountUp({ value, unit, delay = 0 }) {
  const clean = String(value).replace(/\./g, '').replace(',', '.');
  const target = parseFloat(clean) || 0;
  const hasDecimal = String(value).includes(',');
  const [cur, setCur] = useState(0);
  useEffect(() => {
    let start; let raf;
    const t = setTimeout(() => {
      const tick = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1100, 1);
        const e = 1 - (1 - p) ** 3;
        setCur(parseFloat((e * target).toFixed(hasDecimal ? 1 : 0)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target, delay, hasDecimal]);
  const fmt = hasDecimal
    ? cur.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : cur.toLocaleString('pt-BR');
  return <>{fmt}{unit && <span className="u">{unit}</span>}</>;
}

const IC = {
  megafone: ['M4 10v4h3l8 4V6L7 10H4Z', 'M18 9a3 3 0 0 1 0 6'],
  olho: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  pessoas: ['M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z', 'M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6', 'M16.5 5.2a3.2 3.2 0 0 1 0 6.1', 'M21.5 20c0-2.6-1.6-4.6-4-5.4'],
  balao: ['M4 5h16v11H9l-4 4V5Z'],
  subindo: ['M4 18l6-6 3 3 7-7', 'M15 8h6v6'],
  relogio: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 8v4.5l3 2'],
  voltou: ['M9 7L4 12l5 5', 'M4 12h11a5 5 0 0 1 5 5v1'],
  mais: ['M12 5v14', 'M5 12h14'],
};

// Mock (vira dado real na Fase 10f, depende dos tokens da Fase 9).
const DAILY_VISTAS = [1240, 1380, 1640, 1510, 1780, 2020, 2240, 1990, 2120, 2410, 2680, 2540, 2620, 2730, 2900, 3020, 2820, 3160, 3360, 3280, 3450, 3620, 3530, 3760, 3960, 4070, 3880, 4190, 4260, 4480, 4580];
const DAILY_CURTIDAS = [88, 101, 122, 114, 138, 158, 170, 151, 162, 179, 199, 189, 196, 205, 218, 228, 212, 238, 254, 248, 260, 273, 266, 283, 298, 306, 291, 314, 321, 338, 346];
const MONTH_VISTAS = [38, 46, 54, 62, 71, 82, 0, 0, 0, 0, 0, 0].map((v) => v * 1000);
const MONTH_CURTIDAS = [2600, 3200, 3900, 4600, 5400, 6200, 0, 0, 0, 0, 0, 0];

const TOP_POSTS = [
  { tema: 'Óculos de sol verão', curtidas: 587, salvos: 134 },
  { tema: 'Dica de estilo pessoal', curtidas: 492, salvos: 108 },
  { tema: 'Lentes que escurecem no sol', curtidas: 421, salvos: 97 },
  { tema: 'Promoção de aniversário', curtidas: 378, salvos: 63 },
  { tema: 'Novidades da coleção', curtidas: 312, salvos: 88 },
];


const TEMAS_PERF = [
  { tema: 'Óculos de sol', score: 94 }, { tema: 'Dica de estilo', score: 87 },
  { tema: 'Lentes especiais', score: 79 }, { tema: 'Promoções', score: 71 },
  { tema: 'Novidades', score: 65 },
];

const CLIENTES_ORIGEM = [
  { name: 'Balcão', value: 148 }, { name: 'QR Code', value: 84 },
  { name: 'WhatsApp', value: 72 }, { name: 'Indicação', value: 44 },
];

const CLIENTES_SEMANA = [4, 7, 5, 9, 11, 8, 13, 21];

const AGENDA_WEEK = [
  { dia: 'Seg', label: 'Estilo', status: 'published' },
  { dia: 'Ter', label: 'Promo', status: 'approved' },
  { dia: 'Qua', label: 'Dica', status: 'pending' },
  { dia: 'Qui', label: 'Post', status: 'scheduled' },
  { dia: 'Sex', label: 'Post', status: 'scheduled' },
  { dia: 'Sáb', label: 'Post', status: 'scheduled' },
  { dia: 'Dom', label: '—', status: 'off' },
];

const METRICAS = [
  { ic: 'megafone', label: 'Posts publicados no mês', value: '26', unit: '', delta: '+8', pos: true, foot: 'média de 1 post por dia útil' },
  { ic: 'olho', label: 'Pessoas alcançadas', value: '82,3', unit: 'mil', delta: '+24%', pos: true, foot: 'crescimento em relação ao mês passado' },
  { ic: 'pessoas', label: 'Clientes na carteira', value: '348', unit: '', delta: '+21', pos: true, foot: '21 novos cadastrados esse mês' },
  { ic: 'balao', label: 'Conversas no WhatsApp', value: '170', unit: '', delta: '+38 agendamentos', pos: true, foot: '73% respondidas sem você tocar' },
];

// Heatmap: ano inteiro 2026. Jan–Jun com dados, Jul–Dez vazio (futuro).
const HEATMAP_DATA = (() => {
  const data = [];
  const today = new Date('2026-06-01');
  const start = new Date('2026-01-01');
  const end = new Date('2027-01-01');
  for (let i = 0, d = new Date(start); d < end; d.setDate(d.getDate() + 1), i++) {
    if (d > today) { data.push([d.toISOString().slice(0, 10), 0]); continue; }
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const val = Math.max(0, Math.round(
      900 + i * 13
      + Math.sin(i * 0.65) * 280
      + Math.sin(i * 0.28) * 190
      - (weekend ? 480 : 0),
    ));
    data.push([d.toISOString().slice(0, 10), val]);
  }
  return data;
})();

const GRID = { left: 12, right: 18, top: 44, bottom: 28, containLabel: true };
const todayISO = () => new Date().toISOString().slice(0, 10);
const isoDaysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

const PRESETS = [['7d', '7 dias'], ['30d', '30 dias'], ['trimestre', 'Trimestre'], ['ano', 'Ano']];

export default function Dashboard() {
  const now = new Date();
  const { theme } = useTheme();
  refreshTokens(); // relê as cores do tema vigente antes de montar os gráficos
  const [preset, setPreset] = useState('30d');
  const [from, setFrom] = useState(isoDaysAgo(29));
  const [to, setTo] = useState(todayISO());
  const [compare, setCompare] = useState(false);
  const comboRef = useRef(null);

  function zoomChart(direction) {
    const inst = comboRef.current?.getEchartsInstance();
    if (!inst) return;
    const opt = inst.getOption();
    const dz = opt.dataZoom?.[0] ?? {};
    const start = dz.start ?? 0;
    const end = dz.end ?? 100;
    const span = end - start;
    if (direction === 'in') {
      const mid = (start + end) / 2;
      const half = Math.max(10, span * 0.6) / 2;
      inst.dispatchAction({ type: 'dataZoom', dataZoomIndex: 0, start: Math.max(0, mid - half), end: Math.min(100, mid + half) });
    } else {
      inst.dispatchAction({ type: 'dataZoom', dataZoomIndex: 0, start: 0, end: 100 });
    }
  }

  const monthly = preset === 'ano' || preset === 'trimestre';

  function applyPreset(p) {
    setPreset(p);
    const today = todayISO();
    if (p === '7d') { setFrom(isoDaysAgo(6)); setTo(today); }
    else if (p === '30d') { setFrom(isoDaysAgo(29)); setTo(today); }
    else if (p === 'trimestre') {
      const startMonth = Math.max(0, now.getMonth() - 2);
      setFrom(new Date(now.getFullYear(), startMonth, 1).toISOString().slice(0, 10));
      setTo(today);
    }
    else if (p === 'ano') {
      setFrom(`${now.getFullYear()}-01-01`);
      setTo(today);
    }
  }

  const { labels, vistas, curtidas, periodoLabel } = useMemo(() => {
    if (monthly) {
      const end = now.getMonth() + 1;
      const start = preset === 'trimestre' ? Math.max(0, end - 3) : 0;
      return {
        labels: MES_ABBR.slice(start, end),
        vistas: MONTH_VISTAS.slice(start, end),
        curtidas: MONTH_CURTIDAS.slice(start, end),
        periodoLabel: preset === 'trimestre' ? 'últimos 3 meses' : `${now.getFullYear()}`,
      };
    }
    const days = Math.max(1, Math.min(31, Math.round((new Date(to) - new Date(from)) / 86400000) + 1));
    const lbl = Array.from({ length: days }, (_, i) => {
      const d = new Date(from); d.setDate(d.getDate() + i);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });
    return {
      labels: lbl,
      vistas: DAILY_VISTAS.slice(0, days),
      curtidas: DAILY_CURTIDAS.slice(0, days),
      periodoLabel: `${new Date(from).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${new Date(to).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`,
    };
  }, [monthly, preset, from, to, now]);

  // Combo: ÁREA (quem viu) + BARRAS (curtidas). Compare = linha fantasma do período anterior.
  const comboOption = useMemo(() => {
    const series = [
      { ...lineSeries('Pessoas que viram', vistas, TOKENS.primary), yAxisIndex: 0, z: 3 },
      {
        name: 'Curtidas', type: 'bar', data: curtidas, yAxisIndex: 1,
        barWidth: '46%', itemStyle: { color: TOKENS.secondary, borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: TOKENS.champagne } },
      },
    ];
    const legendData = ['Pessoas que viram', 'Curtidas'];
    if (compare) {
      series.push({
        name: 'Mês passado', type: 'line', yAxisIndex: 0,
        data: vistas.map((v) => Math.round(v * 0.84)),
        smooth: 0.3, symbol: 'none', lineStyle: { width: 1.12, type: 'dashed', color: TOKENS.inkMute }, z: 2,
      });
      legendData.push('Mês passado');
    }
    return baseChart({
      grid: GRID,
      legend: { data: legendData, right: 0, top: 4, textStyle: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 12 }, itemGap: 16 },
      xAxis: { ...axisLine(), data: labels, axisLabel: { ...axisLine().axisLabel, interval: Math.ceil(labels.length / 8) } },
      yAxis: [axisValue(), axisValue({ position: 'right', splitLine: { show: false } })],
      dataZoom: [{ type: 'inside' }],
      series,
    });
  }, [labels, vistas, curtidas, compare, theme]);

  const heatmapOption = useMemo(() => {
    const maxVal = Math.max(...HEATMAP_DATA.filter((d) => d[1] > 0).map((d) => d[1]));
    return {
      tooltip: {
        formatter: (p) => {
          if (!p.data || p.data[1] === 0) return '';
          const d = new Date(p.data[0] + 'T12:00:00');
          return `${d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}: <b>${fmtNum(p.data[1])}</b> pessoas`;
        },
      },
      visualMap: {
        show: false, min: 0, max: maxVal,
        inRange: { color: ['#EEF0F8', '#D4880A', '#7A4606'] },
      },
      calendar: {
        range: '2026',
        top: 28, bottom: 28, left: 32, right: 16,
        splitLine: { show: false },
        itemStyle: { borderWidth: 1, borderColor: TOKENS.surface, borderRadius: 2 },
        dayLabel: { firstDay: 1, nameMap: 'pt-br', color: TOKENS.inkMute, fontFamily: FONT, fontSize: 10 },
        monthLabel: { nameMap: 'pt-br', color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 11 },
        yearLabel: { show: true, color: TOKENS.inkMute, fontFamily: FONT, fontSize: 12 },
        cellSize: ['auto', 'auto'],
      },
      series: [{
        type: 'heatmap', coordinateSystem: 'calendar', data: HEATMAP_DATA,
        emphasis: { itemStyle: { shadowBlur: 6, shadowColor: TOKENS.primary } },
      }],
    };
  }, [theme]);

  const clientesSparkOption = useMemo(() => {
    const xLabels = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (7 - i) * 7);
      const day = d.getDate();
      const mon = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      return `${day} ${mon}`;
    });
    const fullDates = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (7 - i) * 7);
      return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    });
    return {
      grid: { left: 4, right: 4, top: 28, bottom: 28, containLabel: true },
      xAxis: {
        type: 'category',
        data: xLabels,
        boundaryGap: false,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: TOKENS.inkMute, fontFamily: FONT, fontSize: 9.5, interval: 'auto' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { lineStyle: { color: TOKENS.hairline, type: 'dashed' } },
        min: (v) => Math.max(0, v.min - 2),
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: TOKENS.surface, borderColor: TOKENS.hairline, borderWidth: 1,
        textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12 },
        formatter: (p) => `${fullDates[p[0].dataIndex]}<br/><b>${p[0].value} novos clientes</b>`,
      },
      series: [{
        type: 'line',
        smooth: 0.35,
        symbol: 'circle', symbolSize: 5,
        lineStyle: { color: '#C1750B', width: 2.5 },
        itemStyle: { color: '#C1750B', borderColor: '#fff', borderWidth: 1.5 },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(193,117,11,0.22)' }, { offset: 1, color: 'rgba(193,117,11,0.02)' }] },
        },
        label: {
          show: true, position: 'top', fontFamily: FONT, fontSize: 10,
          color: TOKENS.ink, fontWeight: 700, offset: [0, -2],
          formatter: (p) => p.dataIndex === CLIENTES_SEMANA.length - 1 ? `{last|${p.value}}` : p.value,
          rich: { last: { color: '#C1750B', fontWeight: 800, fontFamily: FONT, fontSize: 10 } },
        },
        data: CLIENTES_SEMANA,
      }],
    };
  }, [theme]);

  const ORIGEM_COLORS = ['#C1750B', '#638475', '#941C2F', '#8C7B5E'];

  const temasOption = useMemo(() => baseChart({
    grid: { left: 8, right: 36, top: 16, bottom: 8, containLabel: true },
    xAxis: { ...axisValue(), max: 100, axisLabel: { ...axisValue().axisLabel, formatter: (v) => `${v}` } },
    yAxis: {
      type: 'category', data: TEMAS_PERF.map((t) => t.tema).reverse(),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: TOKENS.surface, borderColor: TOKENS.hairline, borderWidth: 1,
      textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12 },
      formatter: (p) => `${p.name}: <b>${p.value} pts</b>`,
    },
    series: [{
      type: 'bar', barWidth: '60%',
      data: TEMAS_PERF.map((t, i) => {
        const solid = IT_PALETTE[i % IT_PALETTE.length];
        return {
          value: t.score,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: solid },
                { offset: 1, color: solid + '55' },
              ],
            },
          },
        };
      }).reverse(),
      label: { show: true, position: 'right', fontFamily: FONT, fontSize: 11, color: TOKENS.inkMute, formatter: (p) => `${p.value}` },
    }],
  }), [theme]);



  return (
    <>
      <div className="dash-head">
        <div className="dash-masthead">
          <div className="dash-eyebrow">RELATÓRIO · {now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}</div>
          <h1 className="dash-hello">Olá, <em>Marcelo</em></h1>
          <p className="dash-sub">{periodoLabel} · Ótica Di Lorenzo</p>
        </div>
        <div className="filterbar">
          <div className="fb-seg">
            {PRESETS.map(([k, lbl]) => (
              <button key={k} className={`fb-btn ${preset === k ? 'active' : ''}`} onClick={() => applyPreset(k)}>{lbl}</button>
            ))}
          </div>
          <span className="fb-div" />
          <div className="range-box">
            <input type="date" className="date-in" value={from} max={to} onChange={(e) => { setFrom(e.target.value); setPreset('custom'); }} />
            <span className="sep">até</span>
            <input type="date" className="date-in" value={to} min={from} max={todayISO()} onChange={(e) => { setTo(e.target.value); setPreset('custom'); }} />
          </div>
          <span className="fb-div" />
          <button className={`fb-btn ${compare ? 'active' : ''}`} onClick={() => setCompare((c) => !c)} title="Mostrar linha do mês passado para comparar">Mês passado</button>
        </div>
      </div>

      <div className="grid-stats" style={{ marginBottom: 22 }}>
        {METRICAS.map((m, i) => (
          <div key={m.label} className={`metric enter enter-${Math.min(i + 1, 4)}`}>
            <div className="metric-top">
              <span className="metric-ic"><Icon paths={IC[m.ic]} /></span>
              <span className="metric-label">{m.label}</span>
            </div>
            <div className="metric-value-row">
              <span className="metric-value"><CountUp value={m.value} unit={m.unit} delay={80 + i * 140} /></span>
              <span className={`metric-delta ${m.pos ? '' : 'neg'}`}>
                <Icon paths={m.pos ? ['M12 19V5', 'M5 12l7-7 7 7'] : ['M12 5v14', 'M5 12l7 7 7-7']} /> {m.delta}
              </span>
            </div>
            <div className="metric-foot">{m.foot}</div>
          </div>
        ))}
      </div>

      <div className="bento">

        {/* Linha 1: alcance principal + WhatsApp */}
        <section className="chart-card span-8 enter" style={{ animationDelay: '60ms' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">Pessoas alcançadas por dia</div>
              <div className="chart-note">linha = quem viu · barras = curtidas</div>
            </div>
            <div className="chart-head-actions">
              <span className="chart-tag">crescendo</span>
              <button className="zoom-btn" onClick={() => zoomChart('in')} title="Aproximar" aria-label="Aproximar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>
              </button>
              <button className="zoom-btn" onClick={() => zoomChart('out')} title="Ver tudo" aria-label="Ver tudo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/></svg>
              </button>
              <InfoButton text={<>Linha = quantas pessoas viram seus posts naquele dia. Barras = curtidas. Role com o mouse pra dar zoom em qualquer período.</>} />
            </div>
          </div>
          <ReactECharts ref={comboRef} echarts={echarts} option={comboOption} style={{ height: 240 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-4 enter" style={{ animationDelay: '120ms', background: 'linear-gradient(155deg, rgba(99,132,117,0.07) 0%, transparent 55%), var(--surface)' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">WhatsApp</div>
              <div className="chart-note">eficiência do atendimento automático</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Taxa resposta = % de conversas atendidas. Resolução bot = % resolvidas sem intervenção humana. Conversão = % que viraram agendamento.</>} />
            </div>
          </div>
          <div className="wa-kpis">
            {[
              { label: 'Taxa de resposta',   value: 92, note: 'conversas atendidas' },
              { label: 'Resolução pelo bot', value: 73, note: 'sem intervenção humana' },
              { label: 'Conversão',          value: 28, note: 'viraram agendamento' },
            ].map((k) => {
              const color = k.value >= 80 ? '#638475' : k.value >= 50 ? '#C1750B' : '#941C2F';
              return (
                <div className="wa-kpi-row" key={k.label}>
                  <div className="wa-kpi-body">
                    <div className="wa-kpi-label">{k.label}</div>
                    <div className="wa-kpi-note">{k.note}</div>
                  </div>
                  <div className="wa-kpi-val" style={{ color }}>{k.value}%</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Linha 2: recall + novos clientes + agenda */}
        <section className="chart-card span-4 enter compact" style={{ animationDelay: '180ms', background: 'linear-gradient(145deg, rgba(148,28,47,0.06) 0%, transparent 50%), var(--surface)' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">Recall de clientes</div>
              <div className="chart-note">funil de reativação — clientes com 1+ ano sem retorno</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>O sistema identifica automaticamente clientes com exame vencido e dispara lembretes pelo WhatsApp.</>} />
            </div>
          </div>
          <div className="recall-flow">
            <div className="rfl-node">
              <span className="rfl-val" style={{ color: '#941C2F' }}>47</span>
              <span className="rfl-label">Vencidos</span>
              <span className="rfl-sub">1+ ano sem exame</span>
            </div>
            <div className="rfl-arrow"><span className="rfl-conv">81%</span><span className="rfl-icon">→</span></div>
            <div className="rfl-node">
              <span className="rfl-val" style={{ color: '#C1750B' }}>38</span>
              <span className="rfl-label">Contactados</span>
              <span className="rfl-sub">recall por WhatsApp</span>
            </div>
            <div className="rfl-arrow"><span className="rfl-conv">58%</span><span className="rfl-icon">→</span></div>
            <div className="rfl-node">
              <span className="rfl-val" style={{ color: '#638475' }}>22</span>
              <span className="rfl-label">Voltaram</span>
              <span className="rfl-sub">taxa de retorno</span>
            </div>
          </div>
        </section>

        <section className="chart-card span-4 enter compact" style={{ animationDelay: '240ms', background: 'linear-gradient(225deg, rgba(99,132,117,0.07) 0%, transparent 50%), var(--surface)' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">Novos clientes</div>
              <div className="chart-note">cadastros por semana · +8 vs anterior</div>
            </div>
            <div className="chart-head-actions">
              <span className="clientes-chip">21<em>esta semana</em></span>
              <InfoButton text={<>Clientes cadastrados por semana. Última barra (ochre) = semana atual. Barras verde = histórico.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={clientesSparkOption} style={{ height: 185 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-4 enter compact" style={{ animationDelay: '300ms', background: 'linear-gradient(315deg, rgba(193,117,11,0.06) 0%, transparent 50%), var(--surface)' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">Posts desta semana</div>
              <div className="chart-note">status de cada publicação agendada</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Verde = publicado. Dourado = aprovado, aguarda horário. Âmbar = aguarda sua aprovação. Cinza = agendado.</>} />
            </div>
          </div>
          <div className="week-grid">
            {AGENDA_WEEK.map((d) => {
              const STATUS_ICON = { published: '✓', approved: '→', pending: '!', scheduled: '·', off: '—' };
              return (
                <div key={d.dia} className={`wg-day ${d.status}`}
                data-label={`${d.dia}: ${d.status === 'off' ? 'Folga' : d.label} (${({ published: 'Publicado', approved: 'Aprovado', pending: 'Aprovar', scheduled: 'Agendado', off: '—' })[d.status]})`}>
                  <span className="wg-dia">{d.dia}</span>
                  <span className="wg-icon">{STATUS_ICON[d.status]}</span>
                  <span className="wg-label">{d.label === '—' ? 'Folga' : d.label}</span>
                </div>
              );
            })}
          </div>
          <div className="wg-legend">
            {[['#638475','✓ Publicado'],['#C1750B','→ Aprovado'],['#D4880A','! Aprovar'],['var(--ink-mute)','· Agendado']].map(([c,l]) => (
              <span key={l} className="wgl-item"><span className="wgl-dot" style={{ background: c }} />{l}</span>
            ))}
          </div>
        </section>

        {/* Linha 3: ranking + temas + origem — todos span-4 */}
        <section className="chart-card span-4 enter compact" style={{ animationDelay: '360ms', background: 'linear-gradient(135deg, rgba(193,117,11,0.07) 0%, transparent 52%), var(--surface)' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">Ranking de posts</div>
              <div className="chart-note">curtidas e salvamentos do período</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<><strong>Salvamentos</strong> valem mais que curtidas — é quando alguém guarda pra ver depois, sinal de interesse real.</>} />
            </div>
          </div>
          <div className="rank-list">
            {TOP_POSTS.slice(0, 3).map((p, i) => {
              const pct = Math.round(p.curtidas / TOP_POSTS[0].curtidas * 100);
              const color = i === 0 ? '#C1750B' : i === 1 ? '#8C8070' : '#A0745A';
              return (
                <div className="rl-row" key={i}>
                  <span className="rl-rank" style={{ color }}>{i + 1}</span>
                  <div className="rl-content">
                    <div className="rl-tema">{p.tema}</div>
                    <div className="rl-stats">
                      <span className="rl-curtidas">{p.curtidas.toLocaleString('pt-BR')} curtidas</span>
                      <span className="rl-salvos">{p.salvos} salvos</span>
                    </div>
                    <div className="rl-bar-track">
                      <div className="rl-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="chart-card span-4 enter compact" style={{ animationDelay: '420ms', background: 'linear-gradient(225deg, rgba(99,132,117,0.09) 0%, transparent 52%), var(--surface)' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">Temas que mais funcionam</div>
              <div className="chart-note">score de performance por tipo de post</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Performance relativa de cada tema de post. Score combina curtidas, salvamentos e alcance.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={temasOption} style={{ height: 140 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-4 enter compact" style={{ animationDelay: '480ms', background: 'linear-gradient(315deg, rgba(148,28,47,0.07) 0%, transparent 52%), var(--surface)' }}>
          <div className="chart-head">
            <div>
              <div className="chart-title">Clientes por origem</div>
              <div className="chart-note">como chegaram até você</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>De onde vieram seus clientes cadastrados. QR Code do balcão, WhatsApp, indicações e atendimento presencial.</>} />
            </div>
          </div>
          <div className="origem-list" style={{ marginTop: 8 }}>
            {(() => {
              const total = CLIENTES_ORIGEM.reduce((s, d) => s + d.value, 0);
              return CLIENTES_ORIGEM.map((d, i) => {
                const pct = Math.round(d.value / total * 100);
                return (
                  <div className="origem-row" key={d.name}>
                    <div className="origem-row-head">
                      <span className="origem-dot" style={{ background: ORIGEM_COLORS[i] }} />
                      <span className="origem-label">{d.name}</span>
                      <div className="origem-stat">
                        <strong>{d.value}</strong>
                        <em>{pct}%</em>
                      </div>
                    </div>
                    <div className="origem-track">
                      <div className="origem-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ORIGEM_COLORS[i]}, ${ORIGEM_COLORS[i]}bb)` }} />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </section>

        {/* Linha 4: heatmap anual — contexto, não dado primário */}
        <section className="chart-card span-12 enter" style={{ animationDelay: '540ms' }}>
          <div className="chart-head" style={{ marginBottom: 4 }}>
            <div>
              <div className="chart-title">Atividade do ano inteiro — 2026</div>
              <div className="chart-note">cada quadrado = 1 dia · mais escuro = mais pessoas viram · meses futuros aparecem vazios</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>365 dias de atividade. Quadrados escuros = mais alcance naquele dia. Fins de semana naturalmente mais claros. Meses futuros ficam em branco.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={heatmapOption} style={{ height: 190 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

      </div>
    </>
  );
}
