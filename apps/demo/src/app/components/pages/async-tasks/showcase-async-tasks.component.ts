import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
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
export class ShowcaseAsyncTasksComponent implements OnInit, AfterViewInit {
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  readonly doc = asyncTaskDoc;
  demoTemplates = new Map<string, TemplateRef<void>>();

  accessToken$: Observable<string> = new Observable<string>();

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

  ngOnInit(): void {
    this.accessToken$ = this.auth.getAccessTokenSilently();
  }

  ngAfterViewInit(): void {
    this.tableConfiguration.detailsTemplate = this.detailsTemplate;
    this.demoTemplates = new Map([['basic', this.tplBasic]]);
    this.cdr.detectChanges();
  }

  editTask(task: unknown): void {
    console.log('Edit Task:', task);
  }

  openTask(task: unknown): void {
    console.log('Open Task:', task);
  }
}
