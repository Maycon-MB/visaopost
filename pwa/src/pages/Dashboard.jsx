import { useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react/lib/core';
import echarts from '../charts/echartsCore.js';
import { baseChart, lineSeries, axisLine, axisValue, TOKENS, FONT, fmtNum, refreshTokens } from '../charts/theme.js';
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


const MONTHLY_GROWTH = [
  { mes: 'Jan', vistas: 38000 }, { mes: 'Fev', vistas: 46000 }, { mes: 'Mar', vistas: 54000 },
  { mes: 'Abr', vistas: 62000 }, { mes: 'Mai', vistas: 71000 }, { mes: 'Jun', vistas: 82000 },
];

const HORA_PICO = [
  { h: '8h', v: 340 }, { h: '9h', v: 520 }, { h: '10h', v: 680 }, { h: '11h', v: 820 },
  { h: '12h', v: 1240 }, { h: '13h', v: 980 }, { h: '14h', v: 760 }, { h: '15h', v: 690 },
  { h: '16h', v: 720 }, { h: '17h', v: 840 }, { h: '18h', v: 1180 }, { h: '19h', v: 1420 },
  { h: '20h', v: 1100 }, { h: '21h', v: 780 }, { h: '22h', v: 480 },
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
    if (p === '7d') { setFrom(isoDaysAgo(6)); setTo(todayISO()); }
    else if (p === '30d') { setFrom(isoDaysAgo(29)); setTo(todayISO()); }
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
        inRange: { color: [TOKENS.hairline, TOKENS.primary, TOKENS.secondary] },
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

  const SMALL_GRID = { left: 8, right: 8, top: 28, bottom: 24, containLabel: true };

  const growthOption = useMemo(() => baseChart({
    grid: SMALL_GRID,
    xAxis: { ...axisLine(), data: MONTHLY_GROWTH.map((d) => d.mes) },
    yAxis: axisValue(),
    series: [{ ...lineSeries('Alcance', MONTHLY_GROWTH.map((d) => d.vistas), TOKENS.primary), yAxisIndex: 0 }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: TOKENS.surface, borderColor: TOKENS.hairline, borderWidth: 1,
      textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12 },
      formatter: (params) => `${params[0].name}: <b>${(params[0].value / 1000).toFixed(0)}k pessoas</b>`,
    },
  }), [theme]);

  const horaOption = useMemo(() => baseChart({
    grid: SMALL_GRID,
    xAxis: { ...axisLine(), data: HORA_PICO.map((d) => d.h), axisLabel: { ...axisLine().axisLabel, interval: 2 } },
    yAxis: axisValue(),
    series: [{
      type: 'bar', data: HORA_PICO.map((d) => d.v),
      barWidth: '72%',
      itemStyle: {
        color: (p) => [4, 11].includes(p.dataIndex)
          ? { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#E8B84B' }, { offset: 1, color: '#B07D14' }] }
          : { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#3EAE74' }, { offset: 1, color: '#1A5C3D' }] },
        borderRadius: [3, 3, 0, 0],
      },
    }],
  }), [theme]);

  const ringGaugeOption = useMemo(() => {
    const COLORS = ['#1A5C3D', '#C4881A', '#2E86AB', '#A23B72'];
    return {
      tooltip: {
        trigger: 'item', backgroundColor: TOKENS.surface, borderColor: TOKENS.hairline, borderWidth: 1,
        textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12 },
        formatter: (p) => `${p.name}: <b>${p.value}</b> clientes (${p.percent}%)`,
      },
      legend: {
        bottom: 0, left: 'center', orient: 'horizontal',
        textStyle: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 11 },
        itemWidth: 10, itemHeight: 10,
      },
      series: [{
        type: 'pie',
        radius: ['46%', '78%'],
        center: ['50%', '45%'],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: (p) => {
            const c = COLORS[p.dataIndex % COLORS.length];
            const m = c.replace('#', '');
            const r = parseInt(m.slice(0,2),16), g = parseInt(m.slice(2,4),16), b = parseInt(m.slice(4,6),16);
            const dark = `rgba(${Math.round(r*0.5)},${Math.round(g*0.5)},${Math.round(b*0.5)},1)`;
            return { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: dark }, { offset: 1, color: c }] };
          },
          borderWidth: 2, borderColor: TOKENS.surface,
        },
        data: CLIENTES_ORIGEM.map((d) => ({ name: d.name, value: d.value })),
      }],
    };
  }, [theme]);

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
      type: 'bar', data: TEMAS_PERF.map((t) => t.score).reverse(), barWidth: 14,
      itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#0D3322' }, { offset: 1, color: '#34A36C' }] }, borderRadius: [0, 5, 5, 0] },
      label: { show: true, position: 'right', fontFamily: FONT, fontSize: 11, color: TOKENS.inkMute, formatter: (p) => `${p.value}` },
    }],
  }), [theme]);

  const atendimentoOption = useMemo(() => {
    const ATEND = [
      { name: 'Taxa resposta', value: 92 },
      { name: 'Resolução bot', value: 73 },
      { name: 'Conversão', value: 28 },
    ];
    const RING_GRAD = [
      ['#0D3322', '#34A36C'], ['#7B4A10', '#E8B84B'], ['#1A3F5C', '#2E86AB'],
    ];
    const offsets = ['-38%', '-4%', '30%'];
    const data = ATEND.map((d, i) => ({
      value: d.value,
      name: d.name,
      itemStyle: {
        color: { type: 'linear', x: 1, y: 0, x2: 0, y2: 0, colorStops: [{ offset: 0, color: RING_GRAD[i][0] }, { offset: 1, color: RING_GRAD[i][1] }] },
      },
      title: { offsetCenter: ['0%', offsets[i]], fontSize: 11, fontFamily: FONT, color: TOKENS.inkSoft },
      detail: {
        offsetCenter: ['0%', `${parseInt(offsets[i]) + 18}%`],
        fontSize: 14, fontWeight: 700, fontFamily: FONT, color: RING_GRAD[i][1],
        formatter: '{value}%',
      },
    }));
    return {
      tooltip: {
        trigger: 'item', backgroundColor: TOKENS.surface, borderColor: TOKENS.hairline, borderWidth: 1,
        textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12 },
        formatter: (p) => `${p.name}: <b>${p.value}%</b>`,
      },
      series: [{
        type: 'gauge', startAngle: 90, endAngle: -270, radius: '100%',
        pointer: { show: false },
        progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: { borderWidth: 3, borderColor: TOKENS.surface } },
        axisLine: { lineStyle: { width: 46, color: [[1, TOKENS.hairline]] } },
        splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false },
        data,
      }],
    };
  }, [theme]);

  const volumeOption = useMemo(() => baseChart({
    grid: { left: 8, right: 8, top: 28, bottom: 24, containLabel: true },
    xAxis: { ...axisLine(), data: MONTHLY_GROWTH.map((d) => d.mes) },
    yAxis: axisValue(),
    series: [{
      type: 'bar', data: [8, 10, 11, 12, 14, 26], barWidth: '52%',
      itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#34A36C' }, { offset: 1, color: '#0D3322' }] }, borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', fontFamily: FONT, fontSize: 11, color: TOKENS.inkMute },
    }],
  }), [theme]);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1 className="dash-hello">Olá, <em>Marcelo</em></h1>
          <p className="dash-sub">Olha só como a Di Lorenzo está indo — {periodoLabel}.</p>
        </div>
        <div className="filterbar">
          <div className="fb-seg">
            {PRESETS.map(([k, lbl]) => (
              <button key={k} className={`fb-btn ${preset === k ? 'active' : ''}`} onClick={() => applyPreset(k)}>{lbl}</button>
            ))}
          </div>
          {!monthly && (
            <>
              <span className="fb-div" />
              <div className="range-box">
                <input type="date" className="date-in" value={from} max={to} onChange={(e) => { setFrom(e.target.value); setPreset('custom'); }} />
                <span className="sep">até</span>
                <input type="date" className="date-in" value={to} min={from} max={todayISO()} onChange={(e) => { setTo(e.target.value); setPreset('custom'); }} />
              </div>
            </>
          )}
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
              <span className="metric-value">{m.value}{m.unit && <span className="u">{m.unit}</span>}</span>
              <span className={`metric-delta ${m.pos ? '' : 'neg'}`}>
                <Icon paths={m.pos ? ['M12 19V5', 'M5 12l7-7 7 7'] : ['M12 5v14', 'M5 12l7 7 7-7']} /> {m.delta}
              </span>
            </div>
            <div className="metric-foot">{m.foot}</div>
          </div>
        ))}
      </div>

      <div className="bento">

        {/* Linha 1: heatmap ano inteiro */}
        <section className="chart-card span-12 enter">
          <div className="chart-head" style={{ marginBottom: 4 }}>
            <div>
              <div className="chart-title">Atividade do ano inteiro — 2026</div>
              <div className="chart-note">cada quadrado = 1 dia · mais escuro = mais pessoas viram · meses futuros aparecem vazios</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>365 dias de atividade. Quadrados escuros = mais alcance naquele dia. Fins de semana naturalmente mais claros. Meses futuros ficam em branco.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={heatmapOption} style={{ height: 215 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        {/* Linha 2: alcance principal + radar WhatsApp */}
        <section className="chart-card span-8 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">Pessoas alcançadas por dia</div>
              <div className="chart-note">linha verde = quem viu · barras douradas = curtidas</div>
            </div>
            <div className="chart-head-actions">
              <span className="chart-tag">crescendo</span>
              <button className="zoom-btn" onClick={() => zoomChart('in')} title="Aproximar" aria-label="Aproximar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>
              </button>
              <button className="zoom-btn" onClick={() => zoomChart('out')} title="Ver tudo" aria-label="Ver tudo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/></svg>
              </button>
              <InfoButton text={<>Linha verde = quantas pessoas viram seus posts naquele dia. Barras douradas = curtidas. Role com o mouse pra dar zoom em qualquer período.</>} />
            </div>
          </div>
          <ReactECharts ref={comboRef} echarts={echarts} option={comboOption} style={{ height: 200 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-4 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">Desempenho do atendimento</div>
              <div className="chart-note">taxa de resposta · resolução pelo bot · conversão em agendamento</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Taxa resposta = % de conversas atendidas. Resolução bot = % resolvidas sem intervenção humana. Conversão = % que viraram agendamento.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={atendimentoOption} style={{ height: 160 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        {/* Linha 2: volume de posts + crescimento + horário de pico */}
        <section className="chart-card span-4 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">Posts publicados por mês</div>
              <div className="chart-note">volume de publicações ao longo do ano</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Quantos posts a Di Lorenzo publicou em cada mês. Junho já ultrapassou todos os meses anteriores.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={volumeOption} style={{ height: 160 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-4 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">Crescimento do alcance</div>
              <div className="chart-note">total de pessoas alcançadas mês a mês</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Crescimento acumulado do alcance mensal. Em 6 meses o alcance mais que dobrou.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={growthOption} style={{ height: 160 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-4 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">Horário de pico</div>
              <div className="chart-note">quando seu público está mais ativo</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Engajamento por hora do dia. Barras douradas = picos. Seus posts saem no momento certo.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={horaOption} style={{ height: 160 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        {/* Linha 3: ranking visual + temas + origem */}
        <section className="chart-card span-5 enter compact">
          <div className="chart-head">
            <div>
              <div className="chart-title">Ranking de posts</div>
              <div className="chart-note">curtidas e salvamentos do período</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<><strong>Salvamentos</strong> valem mais que curtidas — é quando alguém guarda pra ver depois, sinal de interesse real.</>} />
            </div>
          </div>
          <table className="rank-table">
            <thead><tr><th>#</th><th>Publicação</th><th className="num">Curtidas</th><th className="num">Salvos</th></tr></thead>
            <tbody>
              {TOP_POSTS.map((p, i) => {
                const pct = Math.round(p.curtidas / TOP_POSTS[0].curtidas * 100);
                return (
                  <tr key={i} style={{ '--bar': `${pct}%` }}>
                    <td><span className={`rank-badge${i === 0 ? ' gold' : i === 1 ? ' silver' : i === 2 ? ' bronze' : ''}`}>{i + 1}</span></td>
                    <td className="rank-tema">{p.tema}</td>
                    <td className="num rank-bar-cell">
                      <span className="rank-bar-fill" />
                      <span className="rank-bar-val">{p.curtidas.toLocaleString('pt-BR')}</span>
                    </td>
                    <td className="num saved">{p.salvos}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="chart-card span-4 enter compact">
          <div className="chart-head">
            <div>
              <div className="chart-title">Temas que mais funcionam</div>
              <div className="chart-note">score de performance por tipo de post</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Performance relativa de cada tema de post. Score combina curtidas, salvamentos e alcance.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={temasOption} style={{ height: 160 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-3 enter compact">
          <div className="chart-head">
            <div>
              <div className="chart-title">Clientes por origem</div>
              <div className="chart-note">como chegaram até você</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>De onde vieram seus clientes cadastrados. QR Code do balcão, WhatsApp, indicações e atendimento presencial.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={ringGaugeOption} style={{ height: 150 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

      </div>
    </>
  );
}
