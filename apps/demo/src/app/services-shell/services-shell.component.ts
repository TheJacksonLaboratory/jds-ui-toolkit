import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { ServiceDoc, ontologyDoc } from '@jax-data-science/service-docs';

import { ALL_DOCS } from '../docs-shell/docs-shell.component';
import { DocsContextService } from '../docs-shell/docs-context.service';
import { DocsLeftNavComponent } from '../docs-shell/docs-left-nav/docs-left-nav.component';
import { ServicesTabsComponent } from './services-tabs/services-tabs.component';
import { ServicesRightTocComponent } from './services-right-toc/services-right-toc.component';

export const ALL_SERVICE_DOCS: ServiceDoc[] = [ontologyDoc];

const SERVICES_REGISTRY = new Map<string, ServiceDoc>(ALL_SERVICE_DOCS.map((d) => [d.slug, d]));

@Component({
  selector: 'app-services-shell',
  imports: [RouterModule, DocsLeftNavComponent, ServicesTabsComponent, ServicesRightTocComponent],
  templateUrl: './services-shell.component.html',
  standalone: true,
  host: { class: 'tw-flex tw-flex-1 tw-h-full tw-w-full tw-overflow-hidden' },
})
export class ServicesShellComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private docsContext = inject(DocsContextService);
  private destroy$ = new Subject<void>();

  readonly allDocs = ALL_DOCS;
  readonly allServices = ALL_SERVICE_DOCS;
  readonly currentDoc = this.docsContext.currentDoc;
  // Only ever rendered on a Services route, where currentDoc() is a ServiceDoc.
  readonly currentServiceDoc = computed(() => this.currentDoc() as ServiceDoc | null);
  readonly currentSlug = signal<string>('');

  readonly showToc = computed(() => {
    this.currentSlug();
    const url = this.router.url;
    return url.endsWith('/overview') || /\/services\/[^/]+$/.test(url);
  });

  ngOnInit(): void {
    this.updateFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => {
        this.updateFromUrl((e as NavigationEnd).urlAfterRedirects);
      });
  }

  private updateFromUrl(url: string): void {
    const segments = url.split('/').filter(Boolean);
    // URL shape: /services/:slug/:tab — segments[0]='services', segments[1]=slug
    const slug = segments[1] ?? '';
    this.currentSlug.set(slug);
    this.docsContext.setCurrentDoc(SERVICES_REGISTRY.get(slug) ?? null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
