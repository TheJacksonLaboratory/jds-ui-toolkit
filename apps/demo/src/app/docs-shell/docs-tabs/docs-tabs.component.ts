import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-docs-tabs',
  imports: [RouterModule],
  standalone: true,
  template: `
    <nav class="tw-flex tw-border-b tw-border-gray-200 tw-bg-white tw-px-6 tw-gap-1">
      @for (tab of tabs; track tab.label) {
        <a
          [routerLink]="'/components/' + slug + '/' + tab.path"
          routerLinkActive="tw-border-b-2 tw-border-blue-600 tw-text-blue-600 tw-font-semibold"
          class="tw-px-4 tw-py-3 tw-text-sm tw-text-gray-600 hover:tw-text-blue-600 tw-transition-colors tw-no-underline tw-border-b-2 tw-border-transparent">
          {{ tab.label }}
        </a>
      }
    </nav>
  `,
})
export class DocsTabsComponent {
  @Input() slug = '';

  readonly tabs = [
    { label: 'Overview', path: 'overview' },
    { label: 'Variations', path: 'variations' },
    { label: 'Usage', path: 'usage' },
    { label: 'API', path: 'api' },
  ];
}
