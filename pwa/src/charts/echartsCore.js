import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart, HeatmapChart, FunnelChart, RadarChart, GaugeChart, TreemapChart, PictorialBarChart } from 'echarts/charts';
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
  GraphicComponent,
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
  TreemapChart,
  PictorialBarChart,
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
  GraphicComponent,
  SVGRenderer,
]);

export default echarts;
