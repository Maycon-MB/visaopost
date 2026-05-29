import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', mode: 'light', setMode: () => {} });

function systemDark() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolve(mode) {
  if (mode === 'auto') return systemDark() ? 'dark' : 'light';
  return mode;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('dl_theme') || 'light');
  const [theme, setTheme] = useState(() => resolve(localStorage.getItem('dl_theme') || 'light'));

  useEffect(() => {
    localStorage.setItem('dl_theme', mode);
    const apply = () => {
      const t = resolve(mode);
      setTheme(t);
      document.documentElement.dataset.theme = t;
    };
    apply();
    if (mode === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [mode]);

  const value = useMemo(() => ({ theme, mode, setMode }), [theme, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
