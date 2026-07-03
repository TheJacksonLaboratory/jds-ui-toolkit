import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { ComponentDoc, authenticationDoc, facetSearchDoc, navbarDoc, progressWidgetDoc, widgetErrorDoc } from '@jax-data-science/component-docs';

import { DocsContextService } from './docs-context.service';
import { DocsLeftNavComponent } from './docs-left-nav/docs-left-nav.component';
import { DocsTabsComponent } from './docs-tabs/docs-tabs.component';
import { DocsRightTocComponent } from './docs-right-toc/docs-right-toc.component';

const ALL_DOCS: ComponentDoc[] = [
  progressWidgetDoc,
  widgetErrorDoc,
  authenticationDoc,
  navbarDoc,
  facetSearchDoc,
  // append new ComponentDoc objects here as components are migrated
];

const DOCS_REGISTRY = new Map<string, ComponentDoc>(ALL_DOCS.map((d) => [d.slug, d]));

@Component({
  selector: 'app-docs-shell',
  imports: [RouterModule, DocsLeftNavComponent, DocsTabsComponent, DocsRightTocComponent],
  templateUrl: './docs-shell.component.html',
  standalone: true,
  host: { class: 'tw-flex tw-flex-1 tw-h-full tw-w-full tw-overflow-hidden' },
})
export class DocsShellComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private docsContext = inject(DocsContextService);
  private destroy$ = new Subject<void>();

  readonly allDocs = ALL_DOCS;
  readonly currentDoc = this.docsContext.currentDoc;
  readonly currentSlug = signal<string>('');

  readonly showToc = computed(() => {
    // TOC ("On this page") is shown on the Overview tab, which is the single
    // scrolling page. currentSlug() ties the computed to navigation changes.
    this.currentSlug();
    const url = this.router.url;
    return url.endsWith('/overview') || /\/components\/[^/]+$/.test(url);
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
    // URL shape: /components/:slug/:tab — segments[0]='components', segments[1]=slug
    const slug = segments[1] ?? '';
    this.currentSlug.set(slug);
    this.docsContext.setCurrentDoc(DOCS_REGISTRY.get(slug) ?? null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
