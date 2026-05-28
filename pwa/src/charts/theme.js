export const TOKENS = {
  ink: '#1A1A1A',
  inkSoft: '#5C5C5C',
  inkMute: '#8A8579',
  hairline: '#E8E1D4',
  hairlineStrong: '#D6CDB8',
  primary: '#0F5132',
  primaryDeep: '#093724',
  champagne: '#B8895F',
  champagneSoft: '#D9BFA1',
  ivory: '#FBF8F3',
  surface: '#FFFFFF',
};

const FONT = '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif';
const SERIF = '"Fraunces Variable", "Fraunces", Georgia, serif';

export function baseChart(extra = {}) {
  return {
    color: [TOKENS.primary, TOKENS.champagne, TOKENS.inkSoft, TOKENS.primaryDeep],
    textStyle: { fontFamily: FONT, color: TOKENS.ink, fontSize: 12 },
    grid: { left: 10, right: 16, top: 24, bottom: 24, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: TOKENS.surface,
      borderColor: TOKENS.hairline,
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: TOKENS.ink, fontFamily: FONT, fontSize: 12.5, fontWeight: 500 },
      extraCssText: 'box-shadow: 0 16px 36px -24px rgba(15, 81, 50, 0.22); border-radius: 10px;',
      axisPointer: { lineStyle: { color: TOKENS.hairlineStrong, type: 'dashed' } },
    },
    ...extra,
  };
}

export function lineSeries(name, data) {
  return {
    name,
    type: 'line',
    data,
    smooth: 0.35,
    symbol: 'circle',
    symbolSize: 7,
    itemStyle: { color: TOKENS.surface, borderColor: TOKENS.primary, borderWidth: 2 },
    lineStyle: { width: 1.5, color: TOKENS.primary },
    emphasis: { focus: 'series', scale: 1.15 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(15, 81, 50, 0.12)' },
          { offset: 1, color: 'rgba(15, 81, 50, 0.0)' },
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
    nameTextStyle: { color: TOKENS.inkMute, fontFamily: FONT, fontSize: 11 },
    axisLine: { lineStyle: { color: TOKENS.hairlineStrong } },
    axisTick: { show: false },
    axisLabel: { color: TOKENS.inkSoft, fontFamily: FONT, fontSize: 11 },
  };
}

export function axisValue() {
  return {
    type: 'value',
    splitNumber: 4,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: TOKENS.hairline, type: 'dashed' } },
    axisLabel: { color: TOKENS.inkMute, fontFamily: FONT, fontSize: 11 },
  };
}

export { FONT, SERIF };
