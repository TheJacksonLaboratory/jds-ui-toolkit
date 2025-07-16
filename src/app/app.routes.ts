import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

import { ComponentDocsComponent } from './pages/component-docs/component-docs.component';

// showcase components
import { ShowcaseAsyncTasksComponent } from './pages/async-tasks/showcase-async-tasks.component';
import { ShowcaseAuthComponent } from './pages/auth/showcase-auth.component';
import { ShowcaseErrorWidgetComponent } from './pages/error-widget/showcase-error-widget.component';
import { ShowcaseFacetSearchComponent } from './pages/facet-search/showcase-facet-search.component';
import { ShowcaseOntologySearchComponent } from './pages/ontology-search/showcase-ontology-search.component';
import { ShowcaseSchemaGridComponent } from './pages/schema-grid/showcase-schema-grid.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/docs/components',
    pathMatch: 'full'
  },
  {
    path: 'docs/components',
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
    path: '**',
    redirectTo: '/docs/components',
    pathMatch: 'full'
  }
];
