import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

import { ComponentsListComponent } from './pages/components-list/components-list.component';
import { ShowcaseAsyncTasksComponent } from './pages/async-tasks/showcase-async-tasks.component';
import { ShowcaseAuthComponent } from './pages/auth/showcase-auth.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: ComponentsListComponent,
    children: [
      {
        path: 'async-tasks',
        component: ShowcaseAsyncTasksComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'authentication',
        component: ShowcaseAuthComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/search',
    pathMatch: 'full'
  }
];
