import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AsyncTasksComponent } from '@jax-data-science-demo/ui-components';

@Component({
  imports: [RouterModule, AsyncTasksComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'jds-ui-components';
}
