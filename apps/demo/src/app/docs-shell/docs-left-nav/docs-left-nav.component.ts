import { Component, Input, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { ComponentCategory, ComponentDoc } from '@jax-data-science/component-docs';

/** Category display order in the left nav (matches the design). */
const CATEGORY_ORDER: ComponentCategory[] = [
  'Navigation',
  'Input',
  'Messaging',
  'Data Display',
  'Utilities',
];

@Component({
  selector: 'app-docs-left-nav',
  imports: [RouterModule, PanelMenuModule, ButtonModule],
  standalone: true,
  template: `
    <nav
      class="tw-w-60 tw-flex-shrink-0 tw-h-full tw-flex tw-flex-col tw-border-r tw-border-gray-200 tw-bg-white"
    >
      <div class="tw-flex-1 tw-overflow-y-auto tw-p-4">
        <h2 class="tw-text-lg tw-font-bold tw-mb-3 tw-px-2">Components</h2>
        <p-panelMenu [model]="menuItems" styleClass="tw-w-full tw-border-none"></p-panelMenu>
      </div>
      <div class="tw-p-4 tw-border-t tw-border-gray-200">
        <a
          routerLink="/help"
          class="tw-text-sm tw-font-medium tw-text-purple-700 hover:tw-text-purple-900 tw-no-underline"
        >
          Help &amp; Documentation
        </a>
      </div>
    </nav>
  `,
})
export class DocsLeftNavComponent implements OnChanges {
  @Input() docs: ComponentDoc[] = [];

  menuItems: MenuItem[] = [];

  ngOnChanges(): void {
    this.menuItems = CATEGORY_ORDER.flatMap((category) => {
      const inCategory = this.docs.filter((d) => d.category === category);
      if (!inCategory.length) return [];
      return [
        {
          label: category,
          expanded: true,
          items: inCategory.map((d) => ({
            label: d.name,
            routerLink: `/components/${d.slug}/overview`,
          })),
        },
      ];
    });
  }
}
