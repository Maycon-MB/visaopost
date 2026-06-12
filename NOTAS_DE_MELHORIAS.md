# Notas de Melhorias Estéticas do Dashboard

Este documento registra as alterações realizadas para aprimorar a experiência visual do dashboard **automacao_instagram**.

## Principais melhorias

- **Gradiente para ECharts**: adicionado helper `gradient` em `src/charts/theme.js` para criar cores em degradê nos gráficos.
- **Glass‑morphism**: incluído estilo `.chart-card` com fundo translúcido, efeitos blur e bordas sutis para os containers dos gráficos.
- **Tipografia Premium**: integrado a fonte **Jost** via Google Fonts no `public/index.html`.
- **Paleta de Cores**: cores personalizadas e harmoniosas foram definidas em `theme.js` utilizando variáveis HSL.
- **Micro‑animações**: transições suaves ao atualizar dados nos gráficos.

## Como verificar

1. Inicie a aplicação (`npm run dev`).
2. Navegue até a página do dashboard.
3. Observe os novos efeitos de gradiente nos gráficos e o visual de vidro nos cards.

## Próximos passos

- Refatorar o helper para ser reutilizável em outros componentes.
- Documentar o tema em um `README` dedicado.
- Ajustar responsividade para dispositivos móveis.
