// Paleta Di Lorenzo — estética italiana: ocre #C1750B · sage #638475 · borgonha #941C2F
// CSS vars do styles.css são a fonte primária; FALLBACK só quando DOM não disponível.
const FALLBACK = {
  ink: '#03191E', inkSoft: '#1E3038', inkMute: '#556068',
  hairline: '#D8DCF0', hairlineStrong: '#C0C6DC',
  primary: '#C1750B', primaryDeep: '#9A5C08', primaryLight: '#D4880A',
  secondary: '#638475', secondarySoft: '#8BA89A',
  champagne: '#638475', champagneSoft: '#8BA89A',
  ivory: '#F0F2FA', surface: '#FAFBFF', danger: '#941C2F',
};
const VARMAP = {
  ink: '--ink', inkSoft: '--ink-soft', inkMute: '--ink-mute',
  hairline: '--hairline', hairlineStrong: '--hairline-strong',
  primary: '--primary', primaryDeep: '--primary-deep', primaryLight: '--primary-light',
  secondary: '--secondary', secondarySoft: '--secondary-soft',
  champagne: '--champagne', champagneSoft: '--champagne-soft', ivory: '--ivory', surface: '--surface',
  danger: '--danger',
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

export const TOKENS = new Proxy({}, { get: (_, k) => C[k] });

// Paleta italiana: ocre · sage · borgonha · ocre claro · sage claro
export const IT_PALETTE = ['#C1750B', '#638475', '#941C2F', '#D4880A', '#8BA89A'];

const FONT = '"Jost", "Corbel", "Gill Sans", system-ui, sans-serif';

const nf = new Intl.NumberFormat('pt-BR');
export function fmtNum(v) { return nf.format(v); }
export function fmtCompact(v) {
  if (v >= 1000) return `${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`;
  return nf.format(v);
}

export function baseChart(extra = {}) {
  return {
    color: IT_PALETTE,
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
      extraCssText: 'box-shadow: 0 12px 30px -18px rgba(3,25,30,0.32); border-radius: 10px;',
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
    lineStyle: { width: 1.75, color },
    emphasis: { focus: 'series', scale: 1.2 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: rgba(0.22) },
          { offset: 1, color: rgba(0.02) },
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

export { FONT };
