import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
// facades
import { AsyncTaskFacade } from './asynctask.facade';
// models
import { Filter, RunInput } from './asynctask.model';
import { WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';
import { InputText } from 'primeng/inputtext';
import { DataTableDesignTokens } from '@primeng/themes/types/datatable';
import { Drawer } from 'primeng/drawer';
import { Chip } from 'primeng/chip';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { AsyncTaskFilterComponent } from './asynctask-filter/asynctask-filter.component';

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
  allowFilters: boolean;
  filterConfigs?: IFilterConfig[];
}

export interface IFilterConfig {
  displayName: string;
  filterOptions: string[];
}

@Component({
  selector: 'lib-jds-async-tasks',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputText,
    Drawer,
    Chip,
    FormsModule,
    AccordionModule,
    AsyncTaskFilterComponent,
  ],
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
    isStriped: false,
    showActions: true,
    allowFilters: true,
  };
  @Output() editEmitter = new EventEmitter<RunInput>();
  @Output() openEmitter = new EventEmitter<RunInput>();
  // tracking expanded rows
  expandedRows: Record<string, boolean> = {};
  // pagination
  first = 0;
  // filter panel
  filterVisible = false;
  filteredTasks: RunInput[] = [];

  protected readonly WorkflowExecutionStatus = WorkflowExecutionStatus;

  @ViewChild('taskTable') taskTable: Table | undefined;

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

  ngOnInit() {
    // fetches not currently running tasks - completed, failed, terminated, etc.
    this.asyncTaskFacade.fetchAsyncTasks();

    // open server sent events streaming on currently running tasks
    // // TODO: [GIK 4/16/2025] SSE handling to be implemented in IS-75
    this.asyncTaskFacade.openAsyncTaskEventListener();

    // subscribe to task updates
    this.asyncTaskFacade.getTasks$().subscribe((tasks) => {
      this.tasks = tasks;
      this.filteredTasks = tasks;

      // set up filters based on tableConfig
      this.asyncTaskFacade.setUpFilters(this.tableConfig.filterConfigs);

      if (this.tableConfig.defaultExpandedRows) {
        this.expandedRows = this.tableConfig.defaultExpandedRows;
      }
    });

    this.asyncTaskFacade.getActiveFilters$().subscribe({
      next: (filters) => {
        this.activeFilters = filters;
        this.filteredTasks = this.asyncTaskFacade.filterTasks(this.tasks, this.activeFilters);
      },
    });
  }

  /**
   * PrimeNG controller for global search. Global search is currently only compatible with name and description.
   * @param event
   * @param stringVal
   */
  applyFilterGlobal(event: Event, stringVal: string) {
    this.taskTable?.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
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
    const myActiveFilters = this.activeFilters.filter((f) => f.name !== filter.name);
    this.asyncTaskFacade.setActiveFilters(myActiveFilters);
  }

  deleteTask(task: RunInput) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
    this.asyncTaskFacade.deleteTask(task);
  }

  editTask(task: RunInput) {
    this.editEmitter.emit(task);
  }

  openTask(task: RunInput) {
    this.openEmitter.emit(task);
  }

  cancelTask(task: RunInput) {
    this.asyncTaskFacade.cancelTask(task);
    this.tasks.splice(this.tasks.indexOf(task), 1);
  }
}
