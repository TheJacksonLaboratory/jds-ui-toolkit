import { Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
// PrimeNG
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { DataTableDesignTokens } from '@primeng/themes/types/datatable';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
// facades
import { AsyncTaskFacade } from './asynctask.facade';
// models
import { Filter, RunInput } from './asynctask.model';
import { Run, WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';
// components
import { AsyncTaskFilterComponent } from './asynctask-filter/asynctask-filter.component';
import { AsyncTaskDetailsComponent } from './asynctask-details/asynctask-details.component';

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
  allowFilters: boolean;
  filterConfigs?: IFilterConfig[];
  // An HTML template for the body of the expandable row. To work properly, the template must be resolved in
  // ngAfterViewInit of the component that creates the config object.
  detailsTemplate?: TemplateRef<null>;
}

export interface IFilterConfig {
  displayName: string;
  filterOptions: string[];
}

@Component({
  selector: 'lib-jds-async-tasks',
  imports: [
    AsyncTaskFilterComponent,
    AccordionModule,
    ButtonModule,
    Chip,
    CommonModule,
    Drawer,
    FormsModule,
    IconField,
    InputText,
    TableModule,
    InputIconModule,
    AsyncTaskDetailsComponent,
  ],
  templateUrl: './asynctask.component.html',
  styleUrl: './asynctask.component.css',
  standalone: true,
})
export class AsyncTaskComponent implements OnInit, OnDestroy {
  @Input() accessToken = '';

  // table configuration (with defaults)
  @Input() tableConfig: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    isPaginated: true,
    isStriped: false,
    showActions: true,
    allowFilters: true,
  };

  @ViewChild('taskTable') taskTable: Table | undefined;

  protected readonly WorkflowExecutionStatus = WorkflowExecutionStatus;

  tasks: RunInput[] = [];
  filteredTasks: RunInput[] = [];

  @Output() editEmitter = new EventEmitter<RunInput>();
  @Output() openEmitter = new EventEmitter<RunInput>();
  // tracking expanded rows
  expandedRows: Record<string, boolean> = {};
  // events subscription: used to close the SSE connection
  subEvents: Subscription = new Subscription();

  // pagination
  first = 0;
  // filter panel
  filterVisible = false;

  tableDt: DataTableDesignTokens = {
    header: {
      background: '{gray.100}',
    },
    headerCell: {
      background: '{gray.100}',
    },
  };

  activeFilters: Filter[] = [];

  constructor(private asyncTaskFacade: AsyncTaskFacade) {}

  /**
   * onInit: fetches all tasks and opens an SSE connection to get real-time updates
   * about tasks that change status or get created; subscribes to the observable that
   * stores the tasks and their status to show the data in the view.
   */
  ngOnInit() {
    this.asyncTaskFacade.fetchAsyncTasks(); // initial all tasks fetch

    // running tasks can change status to 'completed', 'failed', etc. and new
    // tasks can be created - open an SSE connection to get real-time updates
    this.subEvents = this.asyncTaskFacade
      .openAsyncTasksEventStreaming(this.accessToken)
      .subscribe({
        next: (run: Run) => {
          const runExists =
            this.tasks.find((t) => t.id === run.id) !== undefined;

          // either update an existing task or add a new task
          if (runExists) {
            this.asyncTaskFacade.updateTask(run);
          } else {
            this.asyncTaskFacade.addTask(run);
          }

          // update selected tasks based on the active filters
          this.filteredTasks = this.asyncTaskFacade.filterTasks(
            this.tasks,
            this.activeFilters
          );
        },
        error: (error) => {
          // TODO [GIK 5/15/2025]: error handling to be implemented in G3-631
          console.error('Error fetching async tasks:', error);
        },
      });

    // subscribe to observable that emits when the tasks collection updates
    this.asyncTaskFacade.getTasks$().subscribe((tasks) => {
      this.tasks = tasks;
      this.filteredTasks = tasks;

      // set up filters based on tableConfig
      this.asyncTaskFacade.setUpFilters(this.tableConfig.filterConfigs);

      if (this.tableConfig.defaultExpandedRows) {
        this.expandedRows = this.tableConfig.defaultExpandedRows;
      }
    });

    // subscribe to observable that emits filter selection changes
    this.asyncTaskFacade.getActiveFilters$().subscribe({
      next: (filters) => {
        this.activeFilters = filters;
        this.filteredTasks = this.asyncTaskFacade.filterTasks(
          this.tasks,
          this.activeFilters
        );
      },
    });
  }

  /**
   * onDestroy: closes subscriptions
   */
  ngOnDestroy() {
    if (this.subEvents) {
      this.subEvents.unsubscribe();
    }
  }

  /**
   * Searches the table to find matches for the given search term -
   * only name and description fields are currently supported.
   *
   * @param target - the input element that has the search value
   * @param searchMode - the search mode ('contains', 'startsWith', 'endsWith, etc.)
   */
  applyFilterGlobal(target: HTMLInputElement, searchMode: string): void {
    this.taskTable?.filterGlobal(target.value, searchMode);
  }

  openFilterPanel() {
    this.filterVisible = true;
  }

  clearFilters() {
    this.asyncTaskFacade.clearAllFilters(this.activeFilters);
  }

  /**
   * Removes a filter from the active filters list and clears its selected options.
   * @param filter
   */
  removeFilter(filter: Filter) {
    filter.selectedOptions = [];
    const myActiveFilters = this.activeFilters.filter(
      (f) => f.name !== filter.name
    );
    this.asyncTaskFacade.setActiveFilters(myActiveFilters);
  }

  /**
   * Removes a task from the list of tasks and deletes it from the backend.
   * @param task
   */
  deleteTask(task: RunInput) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
    this.asyncTaskFacade.deleteTask(task);
  }

  /**
   * Emits the task to be edited.
   * @param task
   */
  editTask(task: RunInput) {
    this.editEmitter.emit(task);
  }

  /**
   * Emits the task to be opened.
   * @param task
   */
  openTask(task: RunInput) {
    this.openEmitter.emit(task);
  }

  /**
   * Cancels a running task.
   * @param task
   */
  cancelTask(task: RunInput) {
    this.asyncTaskFacade.cancelTask(task);
  }
}
