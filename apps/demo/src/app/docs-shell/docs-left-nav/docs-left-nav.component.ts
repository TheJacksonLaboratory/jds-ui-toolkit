import { Component, Input, OnChanges, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ComponentDoc } from '@jax-data-science/component-docs';
import { ServiceDoc } from '@jax-data-science/service-docs';

@Component({
  selector: 'app-docs-left-nav',
  imports: [RouterModule],
  standalone: true,
  template: `
    <nav class="tw-w-60 tw-flex-shrink-0 tw-h-full tw-flex tw-flex-col tw-border-r tw-border-gray-200 tw-bg-white tw-overflow-y-auto">
      <div class="tw-p-4 tw-flex tw-flex-col tw-gap-4">

        <!-- Getting Started -->
        @if (section === 'getting-started') {
          <div class="tw-flex tw-flex-col tw-gap-2">
            <div class="tw-flex tw-items-center tw-w-full tw-text-[#454545]">
              <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-book"></i></span>
              <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">Getting Started</span>
            </div>
            <div class="tw-flex tw-flex-col">
              <a #rla1="routerLinkActive" class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none" [class.hover:tw-bg-[rgba(1,119,178,0.08)]]="!rla1.isActive" routerLink="/getting-started/overview" routerLinkActive="tw-bg-[#0177b2] tw-text-white">Overview</a>
              <a #rla2="routerLinkActive" class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none" [class.hover:tw-bg-[rgba(1,119,178,0.08)]]="!rla2.isActive" routerLink="/getting-started/creating-a-component" routerLinkActive="tw-bg-[#0177b2] tw-text-white">Creating a Component</a>
              <a #rla3="routerLinkActive" class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none" [class.hover:tw-bg-[rgba(1,119,178,0.08)]]="!rla3.isActive" routerLink="/getting-started/creating-a-service" routerLinkActive="tw-bg-[#0177b2] tw-text-white">Creating a Service</a>
              <a #rla4="routerLinkActive" class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none" [class.hover:tw-bg-[rgba(1,119,178,0.08)]]="!rla4.isActive" routerLink="/getting-started/about" routerLinkActive="tw-bg-[#0177b2] tw-text-white">About Echo</a>
            </div>
          </div>
        }

        <!-- Components -->
        @if (section === 'components') {
          <div class="tw-flex tw-flex-col tw-gap-2">
            <div class="tw-flex tw-items-center tw-w-full tw-text-[#454545]">
              <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-sitemap"></i></span>
              <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">Components</span>
            </div>
            <div class="tw-flex tw-flex-col">
              @for (doc of sortedDocs; track doc.slug) {
                <a #rla="routerLinkActive"
                   class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none"
                   [class.hover:tw-bg-[rgba(1,119,178,0.08)]]="!rla.isActive"
                   [routerLink]="['/components', doc.slug]"
                   routerLinkActive="tw-bg-[#0177b2] tw-text-white">{{ doc.name }}</a>
              }
            </div>
          </div>
        }

        <!-- Services -->
        @if (section === 'services') {
          <div class="tw-flex tw-flex-col tw-gap-2">
            <div class="tw-flex tw-items-center tw-w-full tw-text-[#454545]">
              <span class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-flex-shrink-0"><i class="pi pi-globe"></i></span>
              <span class="tw-flex-1 tw-text-xl tw-font-normal tw-text-left tw-py-2">API Clients</span>
            </div>
            <div class="tw-flex tw-flex-col">
              @for (doc of services; track doc.slug) {
                <a #rla="routerLinkActive"
                   class="tw-flex tw-items-center tw-p-2 tw-rounded-md tw-text-base tw-text-[#222] tw-no-underline tw-leading-none"
                   [class.hover:tw-bg-[rgba(1,119,178,0.08)]]="!rla.isActive"
                   [routerLink]="['/services', doc.slug]"
                   routerLinkActive="tw-bg-[#0177b2] tw-text-white">{{ doc.name }}</a>
              }
            </div>
          </div>
        }

      </div>
    </nav>
  `,
})
export class DocsLeftNavComponent implements OnChanges, OnDestroy {
  @Input() docs: ComponentDoc[] = [];
  @Input() services: ServiceDoc[] = [];

  private router = inject(Router);
  private destroy$ = new Subject<void>();

  sortedDocs: ComponentDoc[] = [];
  section: 'components' | 'services' | 'getting-started' = 'getting-started';

  constructor() {
    this.section = this.sectionFromUrl(this.router.url);
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => {
        this.section = this.sectionFromUrl((e as NavigationEnd).urlAfterRedirects);
      });
  }

  ngOnChanges(): void {
    this.sortedDocs = [...this.docs].sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private sectionFromUrl(url: string): 'components' | 'services' | 'getting-started' {
    if (url.startsWith('/components')) return 'components';
    if (url.startsWith('/services')) return 'services';
    return 'getting-started';
  }
}
