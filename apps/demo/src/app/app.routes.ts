import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

// Legacy shell components (kept while migrating remaining components)
import { ComponentDocsComponent } from './components/pages/docs/component-docs.component';
import { ServiceDocsComponent } from './services/pages/docs/service-docs.component';

// Legacy showcase components (kept on old routes until migrated)
import { ShowcaseAsyncTasksComponent } from './components/pages/async-tasks/showcase-async-tasks.component';
import { ShowcaseAuthComponent } from './components/pages/auth/showcase-auth.component';
import { ShowcaseErrorWidgetComponent } from './components/pages/error-widget/showcase-error-widget.component';
import { ShowcaseFacetSearchComponent } from './components/pages/facet-search/showcase-facet-search.component';
import { ShowcaseOntologySearchComponent } from './components/pages/ontology-search/showcase-ontology-search.component';
import { ShowcaseSchemaGridComponent } from './components/pages/schema-grid/showcase-schema-grid.component';
import { ShowcaseISADataComponent } from './services/pages/isa-data/showcase-isa-data.component';

// New docs shell
import { DocsShellComponent } from './docs-shell/docs-shell.component';
import { DocOverviewComponent } from './docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocUsageComponent } from './docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocApiComponent } from './docs-shell/tab-content/doc-api/doc-api.component';
import { ShowcaseProgressWidgetComponent } from './components/pages/progress-widget/showcase-progress-widget.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'components/progress-widget/overview',
    pathMatch: 'full',
  },

  // ── New docs shell (pilot: progress-widget) ──────────────────────────────
  {
    path: 'components',
    component: DocsShellComponent,
    children: [
      {
        path: 'progress-widget',
        children: [
          { path: 'overview', component: DocOverviewComponent },
          { path: 'variations', component: ShowcaseProgressWidgetComponent },
          { path: 'usage', component: DocUsageComponent },
          { path: 'api', component: DocApiComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
    ],
  },

  // ── Legacy routes (kept until remaining components are migrated) ─────────
  {
    path: 'components/docs',
    component: ComponentDocsComponent,
    children: [
      { path: 'async-tasks', component: ShowcaseAsyncTasksComponent, canActivate: [AuthGuard] },
      { path: 'authentication', component: ShowcaseAuthComponent },
      { path: 'error-widget', component: ShowcaseErrorWidgetComponent },
      { path: 'facet-search', component: ShowcaseFacetSearchComponent },
      { path: 'ontology-search', component: ShowcaseOntologySearchComponent },
      { path: 'schema-grid', component: ShowcaseSchemaGridComponent },
    ],
  },
  {
    path: 'services/docs',
    component: ServiceDocsComponent,
    children: [
      { path: 'isa-data', component: ShowcaseISADataComponent },
    ],
  },

  {
    path: '**',
    redirectTo: 'components/progress-widget/overview',
    pathMatch: 'full',
  },
];
