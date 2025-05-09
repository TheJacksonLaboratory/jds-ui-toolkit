import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
// facades
import { AsyncTaskFacade } from './asynctask.facade';
// models
import { Filter, FilterOption, RunInput } from './asynctask.model';
import { WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { DataTableDesignTokens } from '@primeng/themes/types/datatable';
import { PaginatorDesignTokens } from '@primeng/themes/types/paginator';
import { Drawer } from 'primeng/drawer';
import { Chip } from 'primeng/chip';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionContent, AccordionHeader, AccordionModule, AccordionPanel } from 'primeng/accordion';
import { Listbox } from 'primeng/listbox';
import { AsyncTaskFilterComponent } from './asynctask-filter/asynctask-filter.component';
import { Observable } from 'rxjs';

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
  // filters: IFilterConfig[];
}

export interface IFilterConfig {
  filterName: string;
  filterType: string;
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
  };
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

  filters: Filter[] = [];
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
      console.log(this.tasks);


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

  applyFilterGlobal($event: Event, stringVal: string) {
    this.taskTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }

  openFilterPanel() {
    this.filterVisible = true;
  }

  clearFilters() {
    this.asyncTaskFacade.clearAllFilters(this.activeFilters);
  }

  removeFilter(filter: Filter) {
    filter.selectedOptions = [];
    const myActiveFilters = this.activeFilters.filter((f) => f.name !== filter.name);
    this.asyncTaskFacade.setActiveFilters(myActiveFilters);
  }
}
