import { Component, Input, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { ComponentDoc } from '@jax-data-science/component-docs';

@Component({
  selector: 'app-docs-left-nav',
  imports: [RouterModule, PanelMenuModule],
  standalone: true,
  template: `
    <nav class="tw-w-60 tw-flex-shrink-0 tw-h-full tw-overflow-y-auto tw-border-r tw-border-gray-200 tw-bg-white">
      <p-panelMenu [model]="menuItems" styleClass="tw-w-full tw-border-none"></p-panelMenu>
    </nav>
  `,
})
export class DocsLeftNavComponent implements OnChanges {
  @Input() docs: ComponentDoc[] = [];

  menuItems: MenuItem[] = [];

  ngOnChanges(): void {
    const components = this.docs.filter((d) => d.group === 'components');
    const services = this.docs.filter((d) => d.group === 'services');

    this.menuItems = [
      {
        label: 'Components',
        icon: 'pi pi-box',
        expanded: true,
        items: components.map((d) => ({
          label: d.name,
          routerLink: `/components/${d.slug}/overview`,
        })),
      },
      ...(services.length
        ? [
            {
              label: 'Services',
              icon: 'pi pi-server',
              expanded: true,
              items: services.map((d) => ({
                label: d.name,
                routerLink: `/services/${d.slug}/overview`,
              })),
            },
          ]
        : []),
    ];
  }
}
