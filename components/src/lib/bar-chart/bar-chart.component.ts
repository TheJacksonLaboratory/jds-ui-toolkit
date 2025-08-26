import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { newPlot, Root, Data } from 'plotly.js-dist-min';
import { BarChartConfig, BarChartData } from './bar-chart.model';

@Component({
  selector: 'lib-bar-chart',
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnInit {
  @Input() data!: BarChartData[];
  @Input() config!: BarChartConfig;

  CHART_COLORS = [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928']


  ngOnInit() {
    const chartElement = document.getElementById('bar-chart') as Root;
    const data: Data[] = [
      {
        x: this.data.map(item => item.label),
        y: this.data.map(item => item.value),
        error_y: {
          type: 'data',
          array: this.data.map(item => item.error),
          visible: true,
        },
        type: 'bar',
        marker: {
          color: this.CHART_COLORS.slice(0, this.data.length),
        },
      },
    ];

    const layout = {
      title: {
        text: this.config.title
      },
      automargin: true,
      yaxis: {
        title: {
          text: this.config.yAxisLabel,
        }
      },
      xaxis: {
        title: {
          text: this.config.xAxisLabel,
        }
      }
    }

    // generate chart
    newPlot(chartElement, data, layout);
  }
}
