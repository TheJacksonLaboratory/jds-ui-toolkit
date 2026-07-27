import { AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AsyncTaskComponent, IAsyncTableConfig } from '@jax-data-science/components';
import { asyncTaskDoc } from '@jax-data-science/component-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocVariationsComponent } from '../../../docs-shell/tab-content/doc-variations/doc-variations.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

@Component({
  selector: 'app-showcase-async-tasks',
  imports: [
    CommonModule,
    DocOverviewComponent,
    DocVariationsComponent,
    DocUsageComponent,
    DocActivityComponent,
    AsyncTaskComponent,
  ],
  templateUrl: './showcase-async-tasks.component.html',
  styleUrl: './showcase-async-tasks.component.css',
  standalone: true,
})
export class ShowcaseAsyncTasksComponent implements AfterViewInit {
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  readonly doc = asyncTaskDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  readonly isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });

  /**
   * The live demo (and its authenticated backend calls) only start once the
   * user explicitly opts in — the docs page itself is viewable without any
   * login. Enabling while logged out triggers Auth0 login first.
   */
  readonly demoEnabled = signal(false);
  accessToken$: Observable<string | null> = of(null);

  tableConfiguration: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 5,
    isPaginated: true,
    rowsPerPageOptions: [5, 10, 25, 50],
    isStriped: false,
    showActions: true,
    allowFilters: true,
  };

  @ViewChild('tplBasic') tplBasic!: TemplateRef<void>;
  @ViewChild('detailsTemplate') detailsTemplate!: TemplateRef<null>;

  ngAfterViewInit(): void {
    this.tableConfiguration.detailsTemplate = this.detailsTemplate;
    this.demoTemplates = new Map([['basic', this.tplBasic]]);
    this.cdr.detectChanges();
  }

  enableDemo(): void {
    if (!this.isAuthenticated()) {
      this.auth.loginWithRedirect();
      return;
    }
    this.demoEnabled.set(true);
    this.accessToken$ = this.auth.getAccessTokenSilently().pipe(catchError(() => of(null)));
  }

  editTask(task: unknown): void {
    console.log('Edit Task:', task);
  }

  openTask(task: unknown): void {
    console.log('Open Task:', task);
  }
}
