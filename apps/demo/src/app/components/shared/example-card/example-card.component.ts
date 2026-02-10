import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw-mb-8">
      <h3 *ngIf="title" class="tw-text-lg tw-font-semibold tw-mb-3 echo-text-slate-800">
        {{ title }}
      </h3>
      <p *ngIf="description" class="tw-text-sm tw-mb-4 echo-text-grey-700">
        {{ description }}
      </p>
      <div class="tw-bg-white tw-rounded-lg tw-border tw-p-6 tw-mb-4 echo-border-grey-200">
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
