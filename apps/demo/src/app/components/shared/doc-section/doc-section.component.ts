import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doc-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="tw-mb-8">
      <h2 class="tw-text-2xl tw-font-semibold tw-mb-4 tw-pb-2 tw-border-b-2 echo-text-slate-900 echo-border-cyan-700"
          [id]="id">
        {{ title }}
      </h2>
      <p *ngIf="description" class="tw-mb-4 echo-text-grey-700">
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
