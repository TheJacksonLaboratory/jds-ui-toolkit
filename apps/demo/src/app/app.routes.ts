import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

// Legacy shell components (kept while migrating remaining components)
import { ComponentDocsComponent } from './components/pages/docs/component-docs.component';
import { ServiceDocsComponent } from './services/pages/docs/service-docs.component';

// Legacy showcase components (kept on old routes until migrated)
import { ShowcaseAsyncTasksComponent } from './components/pages/async-tasks/showcase-async-tasks.component';
import { ShowcaseAuthComponent } from './components/pages/auth/showcase-auth.component';
import { ShowcaseFacetSearchComponent } from './components/pages/facet-search/showcase-facet-search.component';
import { ShowcaseOntologySearchComponent } from './components/pages/ontology-search/showcase-ontology-search.component';
import { ShowcaseSchemaGridComponent } from './components/pages/schema-grid/showcase-schema-grid.component';
import { ShowcaseISADataComponent } from './services/pages/isa-data/showcase-isa-data.component';

// New docs shell
import { DocsShellComponent } from './docs-shell/docs-shell.component';
import { DocPropertiesComponent } from './docs-shell/tab-content/doc-properties/doc-properties.component';
import { DocThemingComponent } from './docs-shell/tab-content/doc-theming/doc-theming.component';
import { DocMethodsComponent } from './docs-shell/tab-content/doc-methods/doc-methods.component';
import { ShowcaseProgressWidgetComponent } from './components/pages/progress-widget/showcase-progress-widget.component';
import { ShowcaseErrorWidgetComponent } from './components/pages/error-widget/showcase-error-widget.component';
import { ShowcaseNavbarComponent } from './components/pages/navbar/showcase-navbar.component';

// New services shell
import { ServicesShellComponent } from './services-shell/services-shell.component';
import { ServiceOverviewComponent } from './services-shell/service-overview/service-overview.component';

// New getting-started shell
import { GettingStartedShellComponent } from './getting-started-shell/getting-started-shell.component';
import { GettingStartedOverviewComponent } from './getting-started/pages/overview/getting-started-overview.component';

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
      // Landing on /components goes to the first documented component.
      { path: '', redirectTo: 'progress-widget/overview', pathMatch: 'full' },
      {
        path: 'progress-widget',
        children: [
          // Overview is the single scrolling page (header + variations + usage + activity).
          { path: 'overview', component: ShowcaseProgressWidgetComponent },
          { path: 'properties', component: DocPropertiesComponent },
          { path: 'theming', component: DocThemingComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'error-widget',
        children: [
          { path: 'overview', component: ShowcaseErrorWidgetComponent },
          { path: 'properties', component: DocPropertiesComponent },
          { path: 'theming', component: DocThemingComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'auth',
        children: [
          { path: 'overview', component: ShowcaseAuthComponent },
          { path: 'properties', component: DocPropertiesComponent },
          { path: 'theming', component: DocThemingComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'navbar',
        children: [
          { path: 'overview', component: ShowcaseNavbarComponent },
          { path: 'properties', component: DocPropertiesComponent },
          { path: 'theming', component: DocThemingComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'facet-search',
        children: [
          { path: 'overview', component: ShowcaseFacetSearchComponent },
          { path: 'properties', component: DocPropertiesComponent },
          { path: 'theming', component: DocThemingComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'async-tasks',
        canActivate: [AuthGuard],
        children: [
          { path: 'overview', component: ShowcaseAsyncTasksComponent },
          { path: 'properties', component: DocPropertiesComponent },
          { path: 'theming', component: DocThemingComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
    ],
  },

  // ── New services shell (pilot: ontology) ─────────────────────────────────
  {
    path: 'services',
    component: ServicesShellComponent,
    children: [
      { path: '', redirectTo: 'ontology/overview', pathMatch: 'full' },
      {
        path: 'ontology',
        children: [
          { path: 'overview', component: ServiceOverviewComponent },
          { path: 'methods', component: DocMethodsComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'isa-data',
        children: [
          { path: 'overview', component: ServiceOverviewComponent },
          { path: 'methods', component: DocMethodsComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'asynctask',
        children: [
          { path: 'overview', component: ServiceOverviewComponent },
          { path: 'methods', component: DocMethodsComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
      {
        path: 'snp-grid',
        children: [
          { path: 'overview', component: ServiceOverviewComponent },
          { path: 'methods', component: DocMethodsComponent },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
        ],
      },
    ],
  },

  // ── New getting-started shell (pilot: overview) ──────────────────────────
  {
    path: 'getting-started',
    component: GettingStartedShellComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: GettingStartedOverviewComponent },
    ],
  },

  // ── Legacy routes (kept until remaining components are migrated) ─────────
  {
    path: 'components/docs',
    component: ComponentDocsComponent,
    children: [
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
