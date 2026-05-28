import ReactECharts from 'echarts-for-react/lib/core';
import echarts from '../charts/echartsCore.js';
import { baseChart, lineSeries, axisLine, axisValue, TOKENS, FONT } from '../charts/theme.js';

const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
});

const REACH = [820, 905, 1102, 970, 1180, 1340, 1490, 1322, 1410, 1605, 1788, 1690, 1740, 1820, 1934, 2010, 1875, 2102, 2240, 2188, 2298, 2410, 2350, 2502, 2640, 2710, 2580, 2790, 2842, 2980];
const ENGAGE = [62, 71, 84, 79, 96, 110, 118, 105, 112, 124, 138, 131, 136, 142, 151, 158, 147, 165, 176, 172, 180, 189, 184, 196, 207, 212, 202, 218, 223, 234];

const STATS = [
  { num: '01', label: 'Posts publicados', value: 26, unit: 'no mês', delta: '+8 vs. abr', positive: true },
  { num: '02', label: 'Alcance Instagram', value: '54,2', unit: 'mil', delta: '+12%', positive: true },
  { num: '03', label: 'Clientes cadastrados', value: 348, unit: 'ativos', delta: '+21 novos', positive: true },
  { num: '04', label: 'Recalls respondidos', value: 19, unit: 'de 42 enviados', delta: '45% resposta', positive: true },
];

const TOP_POSTS = [
  { tema: 'Solar verão', curtidas: 412, salvos: 86 },
  { tema: 'Dica de estilo', curtidas: 358, salvos: 74 },
  { tema: 'Lente antirreflexo', curtidas: 296, salvos: 68 },
  { tema: 'Promo do mês', curtidas: 274, salvos: 41 },
  { tema: 'Depoimento cliente', curtidas: 218, salvos: 52 },
];

const ACTIVITY = [
  { hora: 'há 2h', texto: 'Post de hoje aguarda sua aprovação no email.', kind: 'pending' },
  { hora: 'ontem · 18:42', texto: '3 recalls de exame anual responderam pelo WhatsApp.', kind: 'ok' },
  { hora: 'ontem · 12:00', texto: 'Post "Solar Verão" publicado no Instagram.', kind: 'ok' },
  { hora: '2 dias', texto: 'Cliente Margareth A. cadastrada via QR de balcão.', kind: 'ok' },
];

function StatCard({ stat, idx }) {
  return (
    <div className={`card-aotelier stat enter enter-${Math.min(idx + 1, 4)}`}>
      <div className="eyebrow">
        <span className="eyebrow-num">{stat.num}</span> {stat.label}
      </div>
      <div className="stat-value">
        {stat.value}<span className="stat-unit">{stat.unit}</span>
      </div>
      <div className={`stat-delta ${stat.positive ? '' : 'negative'}`}>
        {stat.positive ? '↗' : '↘'} {stat.delta}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const lineOption = baseChart({
    xAxis: { ...axisLine(), data: DAYS, axisLabel: { ...axisLine().axisLabel, interval: 4 } },
    yAxis: [
      { ...axisValue(), name: 'Alcance', nameTextStyle: { color: TOKENS.inkMute, fontFamily: FONT, fontSize: 10, padding: [0, 0, 0, 30] } },
      { ...axisValue(), name: 'Engajamento', position: 'right', nameTextStyle: { color: TOKENS.champagne, fontFamily: FONT, fontSize: 10, padding: [0, 30, 0, 0] } },
    ],
    legend: {
      data: ['Alcance', 'Engajamento'],
      right: 0,
      top: -4,
      textStyle: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 11 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 18,
    },
    series: [
      { ...lineSeries('Alcance', REACH), yAxisIndex: 0 },
      {
        ...lineSeries('Engajamento', ENGAGE),
        yAxisIndex: 1,
        itemStyle: { color: TOKENS.surface, borderColor: TOKENS.champagne, borderWidth: 2 },
        lineStyle: { width: 1.5, color: TOKENS.champagne, type: 'solid' },
        areaStyle: undefined,
      },
    ],
  });

  const barOption = baseChart({
    grid: { left: 10, right: 30, top: 8, bottom: 12, containLabel: true },
    xAxis: axisValue(),
    yAxis: {
      type: 'category',
      data: TOP_POSTS.map((p) => p.tema).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12.5, fontWeight: 500 },
    },
    legend: {
      data: ['Curtidas', 'Salvos'],
      right: 0,
      top: -4,
      textStyle: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 11 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        name: 'Curtidas',
        type: 'bar',
        data: TOP_POSTS.map((p) => p.curtidas).reverse(),
        barWidth: 10,
        itemStyle: { color: TOKENS.primary, borderRadius: [0, 4, 4, 0] },
      },
      {
        name: 'Salvos',
        type: 'bar',
        data: TOP_POSTS.map((p) => p.salvos).reverse(),
        barWidth: 10,
        itemStyle: { color: TOKENS.champagne, borderRadius: [0, 4, 4, 0] },
      },
    ],
  });

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow"><span className="eyebrow-num">visão geral</span> Maio · 2026</div>
          <h1 className="page-title">Boa tarde, <em className="text-italic-serif" style={{ color: 'var(--champagne)' }}>Sr. Di Lorenzo.</em></h1>
          <p className="page-sub">Eis o que aconteceu na sua ótica nos últimos 30 dias.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="chip active">30 dias</button>
          <button className="chip">90 dias</button>
          <button className="chip">Ano</button>
        </div>
      </div>

      <div className="grid-stats" style={{ marginBottom: 36 }}>
        {STATS.map((s, i) => <StatCard key={s.num} stat={s} idx={i} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 36 }}>
        <section className="card-aotelier enter">
          <div className="section-label" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow"><span className="eyebrow-num">a.</span> Alcance × Engajamento</span>
            <span className="muted text-italic-serif" style={{ fontSize: 13 }}>últimos 30 dias</span>
          </div>
          <ReactECharts echarts={echarts} option={lineOption} style={{ height: 320 }} opts={{ renderer: 'svg' }} />
        </section>

        <section className="card-aotelier enter">
          <div className="section-label" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow"><span className="eyebrow-num">b.</span> Melhores posts do mês</span>
            <span className="muted text-italic-serif" style={{ fontSize: 13 }}>curtidas e salvos</span>
          </div>
          <ReactECharts echarts={echarts} option={barOption} style={{ height: 280 }} opts={{ renderer: 'svg' }} />
        </section>
      </div>

      <section className="card-aotelier enter">
        <div className="section-label">
          <span className="eyebrow"><span className="eyebrow-num">c.</span> Atividade recente</span>
        </div>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
            <span className="ornament" style={{ fontSize: 16, lineHeight: '20px', minWidth: 16 }}>
              {a.kind === 'pending' ? '✻' : '·'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{a.texto}</div>
              <div className="muted" style={{ fontSize: 12 }}>{a.hora}</div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
