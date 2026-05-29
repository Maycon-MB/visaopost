import { useMemo, useState } from 'react';
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
const DAILY_VISTAS = [820, 905, 1102, 970, 1180, 1340, 1490, 1322, 1410, 1605, 1788, 1690, 1740, 1820, 1934, 2010, 1875, 2102, 2240, 2188, 2298, 2410, 2350, 2502, 2640, 2710, 2580, 2790, 2842, 2980, 3050];
const DAILY_CURTIDAS = [62, 71, 84, 79, 96, 110, 118, 105, 112, 124, 138, 131, 136, 142, 151, 158, 147, 165, 176, 172, 180, 189, 184, 196, 207, 212, 202, 218, 223, 234, 240];
const MONTH_VISTAS = [28, 31, 35, 40, 44, 47, 52, 54, 0, 0, 0, 0].map((v) => v * 1000);
const MONTH_CURTIDAS = [1800, 2100, 2400, 2900, 3200, 3500, 3900, 4200, 0, 0, 0, 0];

const TOP_POSTS = [
  { tema: 'Óculos de sol', curtidas: 412, salvos: 86 },
  { tema: 'Dica de estilo', curtidas: 358, salvos: 74 },
  { tema: 'Lentes que escurecem', curtidas: 296, salvos: 68 },
  { tema: 'Promoção do mês', curtidas: 274, salvos: 41 },
  { tema: 'Cliente feliz', curtidas: 218, salvos: 52 },
];

// 3 cores BEM distintas (verde / dourado / azul-ardósia) — sem confundir.
const WA = [
  { nome: 'Respondidas na hora', valor: 124, cor: TOKENS.primary },
  { nome: 'Viraram agendamento', valor: 38, cor: TOKENS.secondary },
  { nome: 'Ainda aguardando', valor: 8, cor: '#5B7C99' },
];

const METRICAS = [
  { ic: 'megafone', label: 'Publicações no mês', value: '26', unit: '', delta: '+8', pos: true, foot: '8 a mais que no mês passado' },
  { ic: 'olho', label: 'Pessoas que viram seus posts', value: '54,2', unit: 'mil', delta: '+12%', pos: true, foot: 'mais gente conhecendo a Di Lorenzo' },
  { ic: 'pessoas', label: 'Clientes na sua carteira', value: '348', unit: '', delta: '+21', pos: true, foot: 'novos no balcão e no site' },
  { ic: 'balao', label: 'Conversas no WhatsApp', value: '170', unit: '', delta: '94% respondidas', pos: true, foot: 'a maioria sem você tocar' },
];

const ATIVIDADE = [
  { ic: 'relogio', kind: 'pending', texto: 'Tem um post novo esperando sua aprovação.', hora: 'há 2 horas' },
  { ic: 'voltou', kind: 'ok', texto: '3 clientes marcaram horário depois da mensagem no WhatsApp.', hora: 'ontem, 18:42' },
  { ic: 'subindo', kind: 'ok', texto: 'Sua publicação de óculos de sol foi ao ar.', hora: 'ontem, 12:00' },
  { ic: 'mais', kind: 'ok', texto: 'Margareth se cadastrou pelo QR Code do balcão.', hora: 'há 2 dias' },
];

const GRID = { left: 12, right: 18, top: 44, bottom: 28, containLabel: true };
const todayISO = () => new Date().toISOString().slice(0, 10);
const isoDaysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

const PRESETS = [['7d', '7 dias'], ['mes', 'Este mês'], ['trimestre', 'Trimestre'], ['ano', 'Ano']];

export default function Dashboard() {
  const now = new Date();
  const { theme } = useTheme();
  refreshTokens(); // relê as cores do tema vigente antes de montar os gráficos
  const [preset, setPreset] = useState('mes');
  const [from, setFrom] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
  const [to, setTo] = useState(todayISO());
  const [compare, setCompare] = useState(false);

  const monthly = preset === 'ano' || preset === 'trimestre';

  function applyPreset(p) {
    setPreset(p);
    if (p === '7d') { setFrom(isoDaysAgo(6)); setTo(todayISO()); }
    else if (p === 'mes') { setFrom(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)); setTo(todayISO()); }
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
        barWidth: '46%', itemStyle: { color: TOKENS.secondarySoft, borderRadius: [4, 4, 0, 0], opacity: 0.85 },
        emphasis: { itemStyle: { color: TOKENS.secondary } },
      },
    ];
    const legendData = ['Pessoas que viram', 'Curtidas'];
    if (compare) {
      series.push({
        name: 'Período anterior', type: 'line', yAxisIndex: 0,
        data: vistas.map((v) => Math.round(v * 0.84)),
        smooth: 0.3, symbol: 'none', lineStyle: { width: 1.6, type: 'dashed', color: TOKENS.inkMute }, z: 2,
      });
      legendData.push('Período anterior');
    }
    return baseChart({
      grid: { ...GRID, bottom: 50 },
      legend: { data: legendData, right: 0, top: 4, textStyle: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 12 }, itemGap: 16 },
      xAxis: { ...axisLine(), data: labels, axisLabel: { ...axisLine().axisLabel, interval: Math.ceil(labels.length / 8) } },
      yAxis: [axisValue(), axisValue({ position: 'right', splitLine: { show: false } })],
      dataZoom: [
        { type: 'inside' },
        { type: 'slider', height: 16, bottom: 8, borderColor: 'transparent', backgroundColor: TOKENS.ivory, fillerColor: 'rgba(26,92,61,0.12)', handleStyle: { color: TOKENS.primary }, moveHandleSize: 4, textStyle: { color: TOKENS.inkMute, fontSize: 10 } },
      ],
      series,
    });
  }, [labels, vistas, curtidas, compare, theme]);

  const barOption = useMemo(() => baseChart({
    grid: { ...GRID, left: 12, right: 28 },
    legend: { data: ['Curtidas', 'Salvos'], right: 0, top: 4, textStyle: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 12 }, icon: 'roundRect', itemWidth: 12, itemHeight: 8, itemGap: 16 },
    xAxis: axisValue(),
    yAxis: {
      type: 'category', data: TOP_POSTS.map((p) => p.tema).reverse(),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: TOKENS.ink, fontFamily: FONT, fontSize: 13, fontWeight: 500 },
    },
    series: [
      { name: 'Curtidas', type: 'bar', data: TOP_POSTS.map((p) => p.curtidas).reverse(), barWidth: 11, itemStyle: { color: TOKENS.primary, borderRadius: [0, 5, 5, 0] } },
      { name: 'Salvos', type: 'bar', data: TOP_POSTS.map((p) => p.salvos).reverse(), barWidth: 11, itemStyle: { color: TOKENS.secondary, borderRadius: [0, 5, 5, 0] } },
    ],
  }), [theme]);

  const waTotal = WA.reduce((s, w) => s + w.valor, 0);
  const donutOption = useMemo(() => ({
    color: WA.map((w) => w.cor),
    tooltip: { trigger: 'item', backgroundColor: TOKENS.surface, borderColor: TOKENS.hairline, borderWidth: 1, textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12.5 }, valueFormatter: (v) => fmtNum(v) },
    series: [{
      type: 'pie', radius: ['60%', '86%'], center: ['50%', '50%'],
      padAngle: 3, itemStyle: { borderRadius: 6, borderColor: TOKENS.surface, borderWidth: 2 },
      label: { show: true, position: 'center', formatter: `{t|${waTotal}}\n{s|conversas}`, rich: {
        t: { fontFamily: '"Fraunces Variable", serif', fontSize: 32, fontWeight: 500, color: TOKENS.ink },
        s: { fontFamily: FONT, fontSize: 12, color: TOKENS.inkMute, padding: [4, 0, 0, 0] },
      } },
      labelLine: { show: false },
      emphasis: { scale: true, scaleSize: 5 },
      data: WA.map((w) => ({ name: w.nome, value: w.valor })),
    }],
  }), [waTotal, theme]);

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
          <button className={`fb-btn ${compare ? 'active' : ''}`} onClick={() => setCompare((c) => !c)} title="Comparar com o período anterior">Comparar</button>
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
        <section className="chart-card span-8 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">Quantas pessoas viram suas publicações</div>
              <div className="chart-note">a área mostra quem viu; as barras, quantas curtidas</div>
            </div>
            <div className="chart-head-actions">
              <span className="chart-tag">crescendo</span>
              <InfoButton text={<>A linha verde é <strong>quanta gente viu</strong> suas publicações por dia. As barras douradas são as <strong>curtidas</strong>. Arraste a barrinha de baixo pra dar zoom num período.</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={comboOption} style={{ height: 300 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-4 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">WhatsApp este mês</div>
              <div className="chart-note">conversas com clientes</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Como estão as conversas no seu WhatsApp: quantas foram <strong>respondidas na hora</strong>, quantas <strong>viraram agendamento</strong> e quantas ainda esperam resposta.</>} />
            </div>
          </div>
          <div className="wa-figure">
            <ReactECharts echarts={echarts} option={donutOption} style={{ height: 184, width: '100%' }} opts={{ renderer: 'svg' }} notMerge />
            <div className="wa-list">
              {WA.map((w) => (
                <div className="wa-item" key={w.nome}>
                  <span className="lbl"><span className="wa-dot" style={{ background: w.cor }} />{w.nome}</span>
                  <span className="val">{w.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="chart-card span-7 enter">
          <div className="chart-head">
            <div>
              <div className="chart-title">As publicações que mais chamaram atenção</div>
              <div className="chart-note">curtidas e quem salvou pra ver depois</div>
            </div>
            <div className="chart-head-actions">
              <InfoButton text={<>Suas publicações com mais <strong>curtidas</strong> e mais <strong>salvamentos</strong> (quando alguém guarda pra ver depois — sinal de interesse forte).</>} />
            </div>
          </div>
          <ReactECharts echarts={echarts} option={barOption} style={{ height: 268 }} opts={{ renderer: 'svg' }} notMerge />
        </section>

        <section className="chart-card span-5 enter">
          <div className="chart-head" style={{ marginBottom: 4 }}>
            <div className="chart-title">O que rolou por aqui</div>
            <div className="chart-head-actions">
              <InfoButton text={<>Um resumo das últimas coisas que aconteceram: posts pra aprovar, clientes que voltaram, publicações no ar e novos cadastros.</>} />
            </div>
          </div>
          {ATIVIDADE.map((a, i) => (
            <div key={i} className="feed-item">
              <span className={`feed-dot ${a.kind}`}><Icon paths={IC[a.ic]} /></span>
              <div>
                <div className="feed-text">{a.texto}</div>
                <div className="feed-time">{a.hora}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
