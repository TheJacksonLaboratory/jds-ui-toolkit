import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetErrorComponent } from '@jax-data-science/components';

@Component({
  selector: 'app-showcase-widget-error',
  imports: [CommonModule, WidgetErrorComponent],
  templateUrl: './showcase-error-widget.component.html',
  styleUrl: './showcase-error-widget.component.css',
  standalone: true
})
export class ShowcaseErrorWidgetComponent implements OnInit {

  ngOnInit() {
    console.log('ShowcaseErrorWidgetComponent initialized');
  }
}