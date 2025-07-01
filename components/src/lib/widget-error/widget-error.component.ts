import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-widget-error',
  imports: [CommonModule],
  templateUrl: './widget-error.component.html',
  styleUrl: './widget-error.component.css',
  standalone: true
})
export class WidgetErrorComponent {
  @Input() errorMessage = '';
}
