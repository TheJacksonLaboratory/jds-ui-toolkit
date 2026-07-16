import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { TocContextService } from '../toc-context.service';

@Component({
  selector: 'app-getting-started-toc',
  imports: [],
  standalone: true,
  template: `
    @if (tocContext.headings().length) {
      <aside class="tw-w-56 tw-flex-shrink-0 tw-h-full tw-overflow-y-auto tw-p-4 tw-border-l tw-border-gray-200 tw-bg-white">
        <p class="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-widest tw-text-gray-400 tw-mb-3">On this page</p>
        <ul class="tw-list-none tw-p-0 tw-m-0 tw-space-y-1">
          @for (item of tocContext.headings(); track item.id) {
            <li>
              <a
                [href]="'#' + item.id"
                class="tw-block tw-text-sm tw-py-1 tw-px-2 tw-rounded tw-transition-colors tw-no-underline"
                [class.tw-font-semibold]="item.id === activeId()"
                [class.tw-text-blue-600]="item.id === activeId()"
                [class.tw-bg-blue-50]="item.id === activeId()"
                [class.tw-text-gray-600]="item.id !== activeId()"
                (click)="scrollTo(item.id, $event)">
                {{ item.title }}
              </a>
            </li>
          }
        </ul>
      </aside>
    }
  `,
})
export class GettingStartedTocComponent implements OnDestroy {
  readonly tocContext = inject(TocContextService);

  activeId = signal<string>('');

  private observer?: IntersectionObserver;
  private readonly intersecting = new Set<string>();

  constructor() {
    effect(() => {
      const headings = this.tocContext.headings();
      this.intersecting.clear();
      this.activeId.set(headings[0]?.id ?? '');
      queueMicrotask(() => this.rebindObserver());
    });
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    this.activeId.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  private rebindObserver(): void {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.intersecting.add(entry.target.id);
          } else {
            this.intersecting.delete(entry.target.id);
          }
        }
        const topmost = this.tocContext.headings().find((h) => this.intersecting.has(h.id));
        if (topmost) this.activeId.set(topmost.id);
      },
      { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
    );
    for (const heading of this.tocContext.headings()) {
      const el = document.getElementById(heading.id);
      if (el) this.observer.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
