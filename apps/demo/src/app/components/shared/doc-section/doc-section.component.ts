import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doc-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="tw-mb-8">
      <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-900 tw-mb-4 tw-pb-2 tw-border-b-2 tw-border-blue-500" [id]="id">
        {{ title }}
      </h2>
      <p *ngIf="description" class="tw-text-gray-600 tw-mb-4">
        {{ description }}
      </p>
      <ng-content></ng-content>
    </section>
  `
})
export class DocSectionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() id = '';
}
