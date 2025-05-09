import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsyncTaskComponent, IAsyncTableConfig } from '@jax-data-science-demo/ui-components';

@Component({
  selector: 'app-showcase-async-tasks',
  imports: [CommonModule, AsyncTaskComponent],
  templateUrl: './showcase-async-tasks.component.html',
  styleUrl: './showcase-async-tasks.component.css',
  standalone: true
})
export class ShowcaseAsyncTasksComponent {
  tableConfiguration: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 5,
    isPaginated: true,
    rowsPerPageOptions: [5, 10, 25, 50],
    isStriped: false,
    showActions: true
  };
}
