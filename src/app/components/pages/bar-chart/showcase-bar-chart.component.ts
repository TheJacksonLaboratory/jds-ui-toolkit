import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent, BarChartConfig } from '@jax-data-science/components';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-showcase-bar-chart',
  imports: [
    CommonModule,
    BarChartComponent
  ],
  templateUrl: './showcase-bar-chart.component.html',
  styleUrl: './showcase-bar-chart.component.css',
})
export class ShowcaseBarChartComponent implements OnInit {
  barChartData = [
    { label: 'Young Control', value: 110, error: 10 },
    { label: 'Old Control', value: 90, error: 11 },
    { label: 'Old NDGA hi', value: 85, error: 9 },
  ];

  barChartConfig: BarChartConfig = {
    title: 'Nordihydroguaiaretic Acid 5000 ppm',
    yAxisLabel: 'Grip Duration [ms]'
  }

  apiData: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get(environment.urls.ISAModelData + '/visualization/measures/data?measureSeriesIds=130499&studyId=740&facetBy=sex&groupBy=age_group,group').subscribe(data => {
      console.log(data);
    })
  }
}
