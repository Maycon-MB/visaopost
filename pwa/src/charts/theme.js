// Tokens espelham o styles.css (paleta verde Di Lorenzo). Series usam verde da
// marca + azul-ardósia como secundária: contraste limpo, corporativo, legível.
// Lê as cores direto das CSS vars (styles.css) → gráfico segue tema claro/escuro.
// Fallback = paleta clara da marca (verde #1a5c3d + dourado #D4880A).
const FALLBACK = {
  ink: '#16201A', inkSoft: '#4D564E', inkMute: '#808A80',
  hairline: '#E3E8DF', hairlineStrong: '#CCD5C9',
  primary: '#1A5C3D', primaryDeep: '#0D3322', primaryLight: '#2E8B57',
  secondary: '#C4881A', secondarySoft: '#E0C074',
  champagne: '#B07D14', champagneSoft: '#E0C074', ivory: '#F6F7F3', surface: '#FFFFFF',
};
const VARMAP = {
  ink: '--ink', inkSoft: '--ink-soft', inkMute: '--ink-mute',
  hairline: '--hairline', hairlineStrong: '--hairline-strong',
  primary: '--primary', primaryDeep: '--primary-deep', primaryLight: '--primary-light',
  secondary: '--secondary', secondarySoft: '--secondary-soft',
  champagne: '--champagne', champagneSoft: '--champagne-soft', ivory: '--ivory', surface: '--surface',
};

let C = { ...FALLBACK };

export function refreshTokens() {
  if (typeof document === 'undefined') return C;
  const cs = getComputedStyle(document.documentElement);
  const next = {};
  for (const [k, v] of Object.entries(VARMAP)) {
    next[k] = cs.getPropertyValue(v).trim() || FALLBACK[k];
  }
  C = next;
  return C;
}
if (typeof document !== 'undefined') refreshTokens();

// TOKENS.x sempre devolve a cor atual do tema vigente.
export const TOKENS = new Proxy({}, { get: (_, k) => C[k] });

const FONT = '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif';
const SERIF = '"Fraunces Variable", "Fraunces", Georgia, serif';

const nf = new Intl.NumberFormat('pt-BR');
export function fmtNum(v) {
  return nf.format(v);
}
export function fmtCompact(v) {
  if (v >= 1000) return `${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`;
  return nf.format(v);
}

export function baseChart(extra = {}) {
  return {
    color: [TOKENS.primary, TOKENS.secondary, TOKENS.champagne, TOKENS.inkSoft],
    textStyle: { fontFamily: FONT, color: TOKENS.ink, fontSize: 12 },
    grid: { left: 8, right: 16, top: 28, bottom: 24, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: TOKENS.surface,
      borderColor: TOKENS.hairline,
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12.5, fontWeight: 500 },
      valueFormatter: (v) => fmtNum(v),
      extraCssText: 'box-shadow: 0 12px 30px -18px rgba(12,63,40,0.28); border-radius: 10px;',
      axisPointer: { lineStyle: { color: TOKENS.hairlineStrong, type: 'dashed' } },
    },
    ...extra,
  };
}

export function lineSeries(name, data, color = TOKENS.primary) {
  const rgba = (a) => {
    const m = color.replace('#', '');
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  return {
    name,
    type: 'line',
    data,
    smooth: 0.3,
    symbol: 'circle',
    symbolSize: 6,
    showSymbol: false,
    itemStyle: { color, borderColor: TOKENS.surface, borderWidth: 2 },
    lineStyle: { width: 2.5, color },
    emphasis: { focus: 'series', scale: 1.2 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: rgba(0.14) },
          { offset: 1, color: rgba(0.0) },
        ],
      },
    },
  };
}

export function axisLine(label = '') {
  return {
    type: 'category',
    name: label,
    nameLocation: 'middle',
    nameGap: 28,
    boundaryGap: false,
    nameTextStyle: { color: TOKENS.inkMute, fontFamily: FONT, fontSize: 11 },
    axisLine: { lineStyle: { color: TOKENS.hairlineStrong } },
    axisTick: { show: false },
    axisLabel: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 11 },
  };
}

export function axisValue(extra = {}) {
  return {
    type: 'value',
    splitNumber: 4,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: TOKENS.hairline } },
    axisLabel: { color: TOKENS.inkMute, fontFamily: FONT, fontSize: 11, formatter: (v) => fmtCompact(v) },
    ...extra,
  };
}

export { FONT, SERIF };
