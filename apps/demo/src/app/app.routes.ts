import { Route } from '@angular/router';

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
import { ALL_DOCS, DocsShellComponent } from './docs-shell/docs-shell.component';
import { DocPropertiesComponent } from './docs-shell/tab-content/doc-properties/doc-properties.component';
import { DocThemingComponent } from './docs-shell/tab-content/doc-theming/doc-theming.component';
import { DocMethodsComponent } from './docs-shell/tab-content/doc-methods/doc-methods.component';
import { ShowcaseProgressWidgetComponent } from './components/pages/progress-widget/showcase-progress-widget.component';
import { ShowcaseErrorWidgetComponent } from './components/pages/error-widget/showcase-error-widget.component';
import { ShowcaseNavbarComponent } from './components/pages/navbar/showcase-navbar.component';

// New services shell
import { ALL_SERVICE_DOCS, ServicesShellComponent } from './services-shell/services-shell.component';
import { ServiceOverviewComponent } from './services-shell/service-overview/service-overview.component';

// New getting-started shell
import { GettingStartedShellComponent } from './getting-started-shell/getting-started-shell.component';
import { GettingStartedOverviewComponent } from './getting-started/pages/overview/getting-started-overview.component';
import { CreatingAComponentComponent } from './getting-started/pages/creating-a-component/creating-a-component.component';
import { CreatingAServiceComponent } from './getting-started/pages/creating-a-service/creating-a-service.component';

/**
 * Picks the slug of whichever component doc sorts first alphabetically by
 * name — the same order the (flattened) left nav displays components in —
 * so the landing redirect stays correct as components are added, removed,
 * or renamed, with nothing hardcoded.
 */
function firstComponentSlug(docs: { slug: string; name: string }[]): string {
  return [...docs].sort((a, b) => a.name.localeCompare(b.name))[0].slug;
}

/**
 * Picks the slug of whichever service doc is listed first — the left nav's
 * Services list is not alphabetically re-sorted (unlike Components), so this
 * intentionally preserves registry order rather than re-sorting by name.
 */
function firstServiceSlug(docs: { slug: string }[]): string {
  return docs[0].slug;
}

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'getting-started/overview',
    pathMatch: 'full',
  },

  // ── New docs shell (pilot: progress-widget) ──────────────────────────────
  {
    path: 'components',
    component: DocsShellComponent,
    children: [
      // Landing on /components defaults to the first documented component's overview.
      { path: '', redirectTo: () => `${firstComponentSlug(ALL_DOCS)}/overview`, pathMatch: 'full' },
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
      // Landing on /services defaults to the first documented service's overview.
      { path: '', redirectTo: () => `${firstServiceSlug(ALL_SERVICE_DOCS)}/overview`, pathMatch: 'full' },
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
      {
        path: 'mvar',
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
      { path: 'creating-a-component', component: CreatingAComponentComponent },
      { path: 'creating-a-service', component: CreatingAServiceComponent },
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
    redirectTo: 'getting-started/overview',
    pathMatch: 'full',
  },
];
