// ─── Paleta oficial Di Lorenzo (PDF brand guide) ─────────────────────────────
// Ochre #C1750B · Rich Black #03191E · Hooker's Green #638475
// Ghost White #F6F8FF · Burgundy #941C2F · Fonte: Jost (web substitute Corbel)

export const colors = {
  // Di Lorenzo palette
  ochre:        '#C1750B',
  ochreDeep:    '#9A5C08',
  ochreLight:   '#D4880A',
  richBlack:    '#03191E',
  sage:         '#638475',
  sageDeep:     '#4A6358',
  sageLight:    '#8BA89A',
  ghostWhite:   '#F6F8FF',
  burgundy:     '#941C2F',

  // Alias legados (internamente mapeados pra Di Lorenzo)
  primary:      '#C1750B',
  gold:         '#C1750B',
  goldLight:    '#D4880A',
  white:        '#FFFFFF',
  textMuted:    'rgba(3, 25, 30, 0.55)',
  glass:        'rgba(255, 255, 255, 0.05)',
  border:       'rgba(193, 117, 11, 0.18)',

  landing: {
    // Substituições Di Lorenzo (nomes preservados p/ compat)
    green:        '#03191E',   // richBlack como base escura
    orange:       '#C1750B',   // ochre
    orangeLight:  '#D4880A',   // ochreLight
    white:        '#ffffff',
    gray:         '#F6F8FF',   // ghostWhite
    text:         '#03191E',
    textMuted:    '#556068',
  },
};

export const fonts = {
  heading: "'Jost', 'Corbel', 'Gill Sans', system-ui, sans-serif",
  body:    "'Jost', 'Corbel', 'Gill Sans', system-ui, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Code', monospace",
};

export const shadows = {
  card:     '0 10px 30px rgba(3, 25, 30, 0.14)',
  gold:     '0 10px 20px rgba(193, 117, 11, 0.28)',
  elevated: '0 30px 60px rgba(3, 25, 30, 0.38)',
};

export const radii = {
  sm:   '12px',
  md:   '16px',
  lg:   '24px',
  xl:   '30px',
  pill: '50px',
  card: '24px',
};
