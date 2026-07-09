import { Component, Input, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentCategory, ComponentDoc } from '@jax-data-science/component-docs';
import { ServiceDoc } from '@jax-data-science/service-docs';

const CATEGORY_ORDER: ComponentCategory[] = [
  'Navigation',
  'Input',
  'Messaging',
  'Data Display',
  'Utilities',
];

interface CategoryGroup {
  category: ComponentCategory;
  docs: ComponentDoc[];
}

@Component({
  selector: 'app-docs-left-nav',
  imports: [RouterModule],
  standalone: true,
  template: `
    <nav class="tw-w-60 tw-flex-shrink-0 tw-h-full tw-flex tw-flex-col tw-border-r tw-border-gray-200 tw-bg-white tw-overflow-y-auto">
      <div class="tw-p-4 tw-flex tw-flex-col tw-gap-4">

        <!-- Getting Started -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <button class="tw-flex tw-items-center tw-w-full tw-bg-transparent tw-border-none tw-cursor-pointer tw-p-0 tw-text-[#454545]" (click)="gettingStartedOpen = !gettingStartedOpen">
            <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-book"></i></span>
            <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">Getting Started</span>
            <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-sm tw-flex-shrink-0 tw-transition-transform tw-duration-150" [class.-tw-rotate-90]="!gettingStartedOpen">
              <i class="pi pi-chevron-down"></i>
            </span>
          </button>
          @if (gettingStartedOpen) {
            <div class="tw-bg-white tw-border tw-border-[#d9d9d9] tw-rounded-md tw-p-1 tw-flex tw-flex-col">
              <a class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]" routerLink="/getting-started/overview" routerLinkActive="tw-bg-[#0177b2] tw-text-white">Overview</a>
              <a class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]" routerLink="/getting-started/creating-a-component" routerLinkActive="tw-bg-[#0177b2] tw-text-white">Creating a Component</a>
              <a class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]" routerLink="/getting-started/creating-a-service" routerLinkActive="tw-bg-[#0177b2] tw-text-white">Creating a Service</a>
              <a class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]" routerLink="/getting-started/about" routerLinkActive="tw-bg-[#0177b2] tw-text-white">About Echo</a>
            </div>
          }
        </div>

        <!-- Components -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <button class="tw-flex tw-items-center tw-w-full tw-bg-transparent tw-border-none tw-cursor-pointer tw-p-0 tw-text-[#454545]" (click)="componentsOpen = !componentsOpen">
            <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-sitemap"></i></span>
            <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">Components</span>
            <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-sm tw-flex-shrink-0 tw-transition-transform tw-duration-150" [class.-tw-rotate-90]="!componentsOpen">
              <i class="pi pi-chevron-down"></i>
            </span>
          </button>
          @if (componentsOpen) {
            <div class="tw-bg-white tw-border tw-border-[#d9d9d9] tw-rounded-md tw-p-1 tw-flex tw-flex-col">
              @for (group of categoryGroups; track group.category) {
                <span class="tw-block tw-px-2 tw-pt-2 tw-pb-1 tw-text-base tw-font-bold tw-text-[#222] tw-leading-none">{{ group.category }}</span>
                @for (doc of group.docs; track doc.slug) {
                  <a class="tw-flex tw-items-center tw-p-2 tw-pl-6 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]"
                     [routerLink]="['/components', doc.slug, 'overview']"
                     routerLinkActive="tw-bg-[#0177b2] tw-text-white">{{ doc.name }}</a>
                }
              }
            </div>
          }
        </div>

        <!-- Services -->
        <div class="tw-flex tw-flex-col tw-gap-2">
          <button class="tw-flex tw-items-center tw-w-full tw-bg-transparent tw-border-none tw-cursor-pointer tw-p-0 tw-text-[#454545]" (click)="servicesOpen = !servicesOpen">
            <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-globe"></i></span>
            <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">API Clients</span>
            <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-sm tw-flex-shrink-0 tw-transition-transform tw-duration-150" [class.-tw-rotate-90]="!servicesOpen">
              <i class="pi pi-chevron-down"></i>
            </span>
          </button>
          @if (servicesOpen) {
            <div class="tw-bg-white tw-border tw-border-[#d9d9d9] tw-rounded-md tw-p-1 tw-flex tw-flex-col">
              @for (doc of services; track doc.slug) {
                <a class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none hover:tw-bg-[rgba(1,119,178,0.08)]"
                   [routerLink]="['/services', doc.slug, 'overview']"
                   routerLinkActive="tw-bg-[#0177b2] tw-text-white">{{ doc.name }}</a>
              }
            </div>
          }
        </div>

      </div>
    </nav>
  `,
})
export class DocsLeftNavComponent implements OnChanges {
  @Input() docs: ComponentDoc[] = [];
  @Input() services: ServiceDoc[] = [];

  categoryGroups: CategoryGroup[] = [];
  gettingStartedOpen = true;
  componentsOpen = true;
  servicesOpen = true;

  ngOnChanges(): void {
    this.categoryGroups = CATEGORY_ORDER.flatMap((category) => {
      const docs = this.docs.filter((d) => d.category === category);
      return docs.length ? [{ category, docs }] : [];
    });
  }
}
