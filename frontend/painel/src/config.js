// Modo demonstração: build estático pro GitHub Pages (/visaopost/app/).
// Sem backend → abre direto no painel, dados de exemplo, sem login real.
// Ligado no build com VITE_DEMO=1. No dev local fica desligado (login real).
export const DEMO = import.meta.env.VITE_DEMO === '1';
