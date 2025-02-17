import { Route } from '@angular/router';

import { ShowcaseAsyncTasksComponent } from './pages/async-tasks/showcase-async-tasks.component';
import { ShowcaseAuthComponent } from './pages/auth/showcase-auth.component';

export const appRoutes: Route[] = [
  {
    path: 'async-tasks',
    component: ShowcaseAsyncTasksComponent
  },
  {
    path: 'authentication',
    component: ShowcaseAuthComponent
  }
];
