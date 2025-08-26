export interface BarChartConfig {
  title: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export interface BarChartData {
  label: string,
  value: number,
  error: number,
  color?: string
}
