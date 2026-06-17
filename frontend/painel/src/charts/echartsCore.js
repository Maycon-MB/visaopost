import * as echarts from 'echarts/core';
import { LineChart, BarChart, HeatmapChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CalendarComponent,
  VisualMapComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

// Só os tipos de gráfico realmente usados no painel (line/bar/heatmap).
// Pie/Funnel/Radar/Gauge/Treemap/PictorialBar nunca foram usados — tirar
// derrubou o chunk de ~814KB pra uma fração disso.
echarts.use([
  LineChart,
  BarChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CalendarComponent,
  VisualMapComponent,
  SVGRenderer,
]);

export default echarts;
