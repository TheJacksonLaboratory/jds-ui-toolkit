import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
// facades
import { AsyncTaskFacade } from './asynctask.facade';
// models
import { RunInput } from './asynctask.model';
import { WorkflowExecutionStatus } from '@jax-data-science/api-clients';

/**
 * TODO: [GIK 4/16/2025] added here (instead of in asynctask.model.ts) so it could be exported to the parent:
 * it should be moved away from here once we decide if we will do a dynamic-table shared component
 */
export interface IAsyncTableConfig {
  isExpandable: boolean;
  defaultExpandedRows?: Record<string, boolean>;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  isPaginated?: boolean;
  isStriped?: boolean;
  showActions: boolean;
}

@Component({
  selector: 'lib-jds-async-tasks',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './asynctask.component.html',
  styleUrl: './asynctask.component.css',
  standalone: true,
})
export class AsyncTaskComponent implements OnInit {
  tasks: RunInput[] = [];

  // table configuration (with defaults)
  @Input() tableConfig: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    isPaginated: true,
    isStriped: true,
    showActions: true,
  };
  // tracking expanded rows
  expandedRows: Record<string, boolean> = {};

  protected readonly WorkflowExecutionStatus = WorkflowExecutionStatus;

  constructor(private asyncTaskFacade: AsyncTaskFacade) { }

  ngOnInit() {
    // fetches not currently running tasks - completed, failed, terminated, etc.
    this.asyncTaskFacade.fetchAsyncTasks();

    // open server sent events streaming on currently running tasks
    // // TODO: [GIK 4/16/2025] SSE handling to be implemented in IS-75
    this.asyncTaskFacade.openAsyncTaskEventListener();

    // subscribe to task updates
    this.asyncTaskFacade.getTasks$().subscribe(
      (tasks) => {
        this.tasks = tasks;

        if(this.tableConfig.defaultExpandedRows) {
          this.expandedRows = this.tableConfig.defaultExpandedRows;
        }
    });
  }
}
