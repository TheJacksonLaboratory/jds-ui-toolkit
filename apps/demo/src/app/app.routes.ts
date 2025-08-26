import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

import { ComponentDocsComponent } from './components/pages/docs/component-docs.component';
import { ServiceDocsComponent } from './services/pages/docs/service-docs.component';

// showcase components
import { ShowcaseAsyncTasksComponent } from './components/pages/async-tasks/showcase-async-tasks.component';
import { ShowcaseAuthComponent } from './components/pages/auth/showcase-auth.component';
import { ShowcaseErrorWidgetComponent } from './components/pages/error-widget/showcase-error-widget.component';
import { ShowcaseFacetSearchComponent } from './components/pages/facet-search/showcase-facet-search.component';
import { ShowcaseOntologySearchComponent } from './components/pages/ontology-search/showcase-ontology-search.component';
import { ShowcaseSchemaGridComponent } from './components/pages/schema-grid/showcase-schema-grid.component';
// showcase services
import { ShowcaseISADataComponent } from './services/pages/isa-data/showcase-isa-data.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/docs/components',
    pathMatch: 'full'
  },
  {
    path: 'components/docs',
    component: ComponentDocsComponent,
    children: [
      {
        path: 'async-tasks',
        component: ShowcaseAsyncTasksComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'authentication',
        component: ShowcaseAuthComponent
      },
      {
        path: 'error-widget',
        component: ShowcaseErrorWidgetComponent
      },
      {
        path: 'facet-search',
        component: ShowcaseFacetSearchComponent
      },
      {
        path: 'ontology-search',
        component: ShowcaseOntologySearchComponent
      },
      {
        path: 'schema-grid',
        component: ShowcaseSchemaGridComponent
      }
    ]
  },
  {
    path: 'services/docs',
    component: ServiceDocsComponent,
    children: [{
      path: 'isa-data',
      component: ShowcaseISADataComponent
    }]
  },
  {
    path: '**',
    redirectTo: '/docs/components',
    pathMatch: 'full'
  }
];
