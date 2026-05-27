// ─── src/styles/theme.js ───────────────────────────────────────────
// Shared color palette and design tokens used across all pages.

export const colors = {
  // Dark / SaaS presentation palette
  dark: '#0B1F0F',
  primary: '#0D3322',
  gold: '#D4880A',
  goldLight: '#F5A623',
  white: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  glass: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(212, 136, 10, 0.2)',
  blueLight: '#38bdf8',
  green: '#22c55e',

  // Landing page palette (lighter, client-facing)
  landing: {
    green: '#0D3322',
    orange: '#D4880A',
    orangeLight: '#F5A623',
    white: '#ffffff',
    gray: '#F8F9FA',
    text: '#1A2E1C',
    textMuted: '#5A7A62',
  },
};

export const fonts = {
  heading: "'Playfair Display', serif",
  body: "'Montserrat', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

export const shadows = {
  card: '0 10px 30px rgba(0,0,0,0.2)',
  gold: '0 10px 20px rgba(212, 136, 10, 0.3)',
  elevated: '0 30px 60px rgba(0,0,0,0.5)',
};

export const radii = {
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '30px',
  pill: '50px',
  card: '40px',
};
