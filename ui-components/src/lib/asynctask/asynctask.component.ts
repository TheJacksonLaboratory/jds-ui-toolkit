import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
// facades
import { AsyncTaskFacade } from './asynctask.facade';
// models
import { RunInput } from './asynctask.model';
// services
import { WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';

/**
 * TODO: [GIK 4/16/2025] added here (instead of in asynctask.model.ts) so it
 * could easily be exported to the parent: it should be moved away from here
 * once we decide if we will do a dynamic-table shared component.
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
export class AsyncTaskComponent implements OnInit, OnDestroy {
  @Input() accessToken: string = '';

  // table configuration (with defaults)
  @Input() tableConfig: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    isPaginated: true,
    isStriped: true,
    showActions: true,
  };

  protected readonly WorkflowExecutionStatus = WorkflowExecutionStatus;

  tasks: RunInput[] = [];

  // tracking expanded rows
  expandedRows: Record<string, boolean> = {};
  // events subscription: used to close the SSE connection
  subEvents: Subscription = new Subscription();
  constructor(private asyncTaskFacade: AsyncTaskFacade) { }

  /**
   * onInit: fetches all tasks and opens an SSE connection to get real-time updates
   * about tasks that change status or get created; subscribes to the observable that
   * stores the tasks and their status to show the data in the view.
   */
  ngOnInit() {
    // fetch all tasks: 'completed', 'failed', 'running', 'terminated', etc.
    this.asyncTaskFacade.fetchAsyncTasks();

    // running tasks can change status ('completed', 'failed', etc.) and new
    // tasks can be created, so open an SSE connection to get real-time updates
    this.subEvents = this.asyncTaskFacade.openAsyncTasksEventStreaming(this.accessToken).subscribe();

    // subscribe to the tasks observable that has the current tasks state
    this.asyncTaskFacade.getTasks$().subscribe(
      (tasks: RunInput[]) => {
        this.tasks = tasks;
        console.log(this.tasks);
        if(this.tableConfig.defaultExpandedRows) {
          this.expandedRows = this.tableConfig.defaultExpandedRows;
        }
    });
  }

  /**
   * onDestroy: closes active subscriptions
   */
  ngOnDestroy() {
    console.log('running onDestroy');
    if(this.subEvents) {
      this.subEvents.unsubscribe();
    }
  }
}
