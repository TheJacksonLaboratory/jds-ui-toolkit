import {
  AfterViewChecked,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  signal,
} from '@angular/core';
import { ServiceDoc } from '@jax-data-science/service-docs';

interface TocItem {
  id: string;
  title: string;
}

@Component({
  selector: 'app-services-right-toc',
  imports: [],
  standalone: true,
  template: `
    <aside class="tw-w-56 tw-flex-shrink-0 tw-h-full tw-overflow-y-auto tw-p-4 tw-border-l tw-border-gray-200 tw-bg-white">
      <p class="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-widest tw-text-gray-400 tw-mb-3">On this page</p>
      <ul class="tw-list-none tw-p-0 tw-m-0 tw-space-y-1">
        @for (item of items(); track item.id) {
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
  `,
})
export class ServicesRightTocComponent implements OnChanges, AfterViewChecked, OnDestroy {
  @Input() doc!: ServiceDoc;

  items = signal<TocItem[]>([]);
  activeId = signal<string>('');

  private observer?: IntersectionObserver;
  private needsObserverRebind = false;

  ngOnChanges(): void {
    this.items.set(this.buildItems());
    this.needsObserverRebind = true;
  }

  ngAfterViewChecked(): void {
    if (this.needsObserverRebind) {
      this.needsObserverRebind = false;
      this.rebindObserver();
    }
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  /** Summary + each usage example + Usage + Activity (per the services docs design). */
  private buildItems(): TocItem[] {
    if (!this.doc) return [];
    const items: TocItem[] = [{ id: 'summary', title: 'Summary' }];
    for (const example of this.doc.usageExamples) {
      items.push({ id: example.id, title: example.title });
    }
    items.push({ id: 'usage', title: 'Usage' });
    if (this.doc.activity) {
      items.push({ id: 'activity', title: 'Activity' });
    }
    return items;
  }

  private rebindObserver(): void {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          this.activeId.set(visible[0].target.id);
        }
      },
      { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
    );
    for (const item of this.items()) {
      const el = document.getElementById(item.id);
      if (el) this.observer.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
