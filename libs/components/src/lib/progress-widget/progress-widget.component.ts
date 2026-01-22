import { Component } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'lib-jds-progress-widget',
  imports: [ProgressSpinner],
  templateUrl: './progress-widget.component.html',
  styleUrl: './progress-widget.component.css',
})
export class ProgressWidgetComponent {}
