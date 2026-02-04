import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw-mb-8">
      <h3 *ngIf="title" class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-3">
        {{ title }}
      </h3>
      <p *ngIf="description" class="tw-text-sm tw-text-gray-600 tw-mb-4">
        {{ description }}
      </p>
      <div class="tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-p-6 tw-mb-4">
        <ng-content select="[demo]"></ng-content>
      </div>
      <ng-content select="[code]"></ng-content>
    </div>
  `
})
export class ExampleCardComponent {
  @Input() title = '';
  @Input() description = '';
}
