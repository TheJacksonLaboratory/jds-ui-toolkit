import { Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-docs-tabs',
  imports: [TabsModule],
  standalone: true,
  template: `
    <p-tabs [value]="activeTab()" (valueChange)="navigate($event)" styleClass="tw-px-4">
      <p-tablist>
        @for (tab of tabs; track tab.path) {
          <p-tab [value]="tab.path">{{ tab.label }}</p-tab>
        }
      </p-tablist>
    </p-tabs>
  `,
})
export class DocsTabsComponent implements OnInit, OnDestroy {
  @Input() slug = '';

  private router = inject(Router);
  private destroy$ = new Subject<void>();

  readonly activeTab = signal<string>('overview');

  readonly tabs = [
    { label: 'Overview', path: 'overview' },
    { label: 'Properties', path: 'properties' },
    { label: 'Theming', path: 'theming' },
  ];

  ngOnInit(): void {
    this.syncFromUrl(this.router.url);
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => this.syncFromUrl((e as NavigationEnd).urlAfterRedirects));
  }

  navigate(value: string | number | undefined): void {
    if (!value || value === this.activeTab()) return;
    this.router.navigate(['/components', this.slug, value]);
  }

  private syncFromUrl(url: string): void {
    const last = url.split('?')[0].split('/').filter(Boolean).pop() ?? '';
    const match = this.tabs.find((t) => t.path === last);
    this.activeTab.set(match ? match.path : 'overview');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
