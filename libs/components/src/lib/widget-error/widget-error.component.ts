import { Component, Input } from '@angular/core';


@Component({
  selector: 'lib-widget-error',
  imports: [],
  templateUrl: './widget-error.component.html',
  styleUrl: './widget-error.component.css',
  standalone: true
})
export class WidgetErrorComponent {
  @Input() errorMessage = '';
}
