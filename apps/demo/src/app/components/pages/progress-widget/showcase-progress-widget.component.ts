import { Component } from '@angular/core';
import { ProgressWidgetComponent } from '@jax-data-science/components';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-showcase-progress-widget',
  imports: [ProgressWidgetComponent, ProgressSpinner],
  templateUrl: './showcase-progress-widget.component.html',
  styleUrl: './showcase-progress-widget.component.css',
})
export class ShowcaseProgressWidgetComponent {}
