import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart, HeatmapChart, FunnelChart, RadarChart, GaugeChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  CalendarComponent,
  VisualMapComponent,
  RadarComponent,
  PolarComponent,
  DatasetComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  HeatmapChart,
  FunnelChart,
  RadarChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  CalendarComponent,
  VisualMapComponent,
  RadarComponent,
  PolarComponent,
  DatasetComponent,
  SVGRenderer,
]);

export default echarts;
