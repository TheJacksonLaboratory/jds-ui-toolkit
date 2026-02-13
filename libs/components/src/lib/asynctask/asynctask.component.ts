import {
  Component,
  computed,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, of, Subscription, switchMap } from 'rxjs';

// PrimeNG components
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DataTableDesignTokens } from '@primeuix/themes/types/datatable';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
// facades
import { AsyncTaskFacade } from './asynctask.facade';
// models
import { WorkflowExecutionStatus } from '@jax-data-science/api-clients';
import { IFacetSearchConfig, IFacetSearchCategory, IFacetOption } from '../facet-search/facet-search.model';
import { IAsyncTableConfig, RunInput } from './asynctask.model';

// components
import { AsyncTaskDetailsComponent } from './asynctask-details/asynctask-details.component';
import { FacetSearchComponent } from '../facet-search/facet-search.component';
import { WidgetErrorComponent } from '../widget-error/widget-error.component';
// services
import { FacetSearchFacade } from '../facet-search/facet-search.facade';

@Component({
  selector: 'lib-jds-async-tasks',
  imports: [
    ButtonModule,
    ChipModule,
    CommonModule,
    FacetSearchComponent,
    FormsModule,
    IconFieldModule,
    InputTextModule,
    TableModule,
    InputIconModule,
    AsyncTaskDetailsComponent,
    WidgetErrorComponent
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

  // facet search configuration
  searchConfig: IFacetSearchConfig = {
    isToggable: true,
    isVisible: false
  };
  // facet search categories (will be passed to the FacetSearchComponent)
  searchCategories: IFacetSearchCategory[] = [];

  protected readonly WorkflowExecutionStatus = WorkflowExecutionStatus;

  // TODO [GIK 2025-06-20]: use an array of errors instead of a single string
  error: string | null = null; // UI error message

  @ViewChild('taskTable') taskTable: Table | undefined;
  @ViewChild('taskTableContainer') taskTableContainer!: ElementRef<HTMLDivElement>;

  tasks: RunInput[] = [];

  isDataLoading = true; // tracks whether the data is loading

  // computed property to get visible tasks based on applied filters
  visibleTasks = computed(() => {
    let tempVisibleTasks = [...this.tasks];
    // every time the applied searches change, we need to filter the tasks
    const appliedSearches = this.facetSearchFacade.getAppliedSearches$()();

    Object.values(appliedSearches).forEach(selectedOptionIds => {
      if(selectedOptionIds.length > 0) {
        tempVisibleTasks = tempVisibleTasks.filter((task: RunInput) => {
          const taskStatus = task.status?.toString() || '';
          return selectedOptionIds.includes(taskStatus);
        });
      }
    });

    return tempVisibleTasks;
  });

  @Output() editEmitter = new EventEmitter<RunInput>();
  @Output() openEmitter = new EventEmitter<RunInput>();
  // tracking expanded rows
  expandedRows: Record<string, boolean> = {};
  // events subscription: used to close the SSE connection
  subEvents: Subscription = new Subscription();

  // pagination
  first = 0; // TODO [GIK 2025-06-20]: rename variable

  tableDt: DataTableDesignTokens = {
    header: {
      background: '{gray.100}',
    },
    headerCell: {
      background: '{gray.100}',
    },
  };

  constructor(
    private asyncTaskFacade: AsyncTaskFacade,
    private facetSearchFacade: FacetSearchFacade
  ) {}

  /**
   * onInit: fetches all tasks and opens an SSE connection to get real-time updates
   * about tasks that might change status or get created; subscribes to the observable
   * that stores the current tasks list to be displayed in the UI.
   */
  ngOnInit() {
    this.asyncTaskFacade.fetchAsyncTasks(); // fetch all tasks

    // subscribe to an SSE streaming observable, which allows to show real-time
    // updates as existing tasks change status (to 'completed', 'failed', etc.) or
    // new tasks get created; SSE connection is manually closed on component destroy
    this.subEvents = this.asyncTaskFacade.openAsyncTasksEventStreaming(this.accessToken);

    // subscribe to observable that emits when the tasks collection updates
    this.asyncTaskFacade.getTasks$().pipe(
      switchMap((tasks: RunInput[]) => {
        if(tasks.length === 0) {
          // check the errors observable when tasks are empty
          return this.asyncTaskFacade.getResponseError$().pipe(
            map((error: string | null) => ({ tasks: [], error: error }))
          );
        } else {
          return of({ tasks: tasks, error: null });
        }
      })).subscribe({
      next: ({tasks, error}) => {
        this.tasks = tasks;

        this.isDataLoading = false;

        // init the facet search categories - there's only one category: 'Status'
        this.initializeSearchCategories();
        this.updateSearchCategoryOptionCounts();

        if(this.tableConfig.defaultExpandedRows) {
          this.expandedRows = this.tableConfig.defaultExpandedRows;
        }
      }
    });

    // subscribe to observable that emits errors
    // TODO: [GIK 2025-06-20] check whtehr this subscription is necessary: SSE?
    this.asyncTaskFacade.getResponseError$().subscribe({
      next: (error) => {
        this.isDataLoading = false;
        this.error = error;
      },
    });

    // initialize search categories
    this.initializeSearchCategories();
  }

  /**
   * onDestroy: closes subscriptions
   */
  ngOnDestroy() {
    if(this.subEvents) {
      // this.subEvents.unsubscribe();
    }
  }

  /**
   * Initializes the 'Status' search category with options based on the
   * WorkflowExecutionStatus enum - each option's counts will be updated later.
   * @private
   * @return {void}
   */
  private initializeSearchCategories(): void {
    const statusOptions: IFacetOption[] = [];
    // convert the WorkflowExecutionStatus enum to an object for easier manipulation
    const enumObject = WorkflowExecutionStatus as Record<string, string | number>;

    // due to TypeScript's numeric enum bidirectional mapping, enumObject looks like this:
    // { '1': 'RUNNING', '2': 'COMPLETED', '3': 'FAILED', ..., 'RUNNING': 1, 'COMPLETED': 2, 'FAILED': 3, ... }
    // we need to filter out the numeric keys and only keep the string keys
    Object.keys(enumObject)
      .filter(key => isNaN(Number(key)))
      .forEach(key => {
        const enumValue = enumObject[key].toString();

        const displayName = this.formatEnumKeyForDisplay(key);
        statusOptions.push({
          id: enumValue,
          label: displayName,
          selected: false, // might be updated in updatedSearchCategoryOptionCounts()
          count: 0 // might be updated in updateSearchCategoryOptionCounts()
        });
      });

    this.searchCategories = [{
      name: 'status',
      label: 'Status',
      isOpen: true,
      showZeroCount: false,
      options: statusOptions
    }];
  }

  /**
   * Updates the counts of each option in the 'Status' search category
   * based on the current tasks' collection.
   * @private
   */
  private updateSearchCategoryOptionCounts(): void {
    const statusSearchCategory = this.searchCategories.find(cat => cat.name === 'status');

    if(statusSearchCategory && statusSearchCategory.options) {
      // reset each option's count to 0
      statusSearchCategory.options.forEach(option => option.count = 0);

      // update each option's counts based on current async tasks' collection
      this.tasks.forEach(task => {
        const optionToUpdate = statusSearchCategory.options.find(option => option.id === task.status?.toString());
        if(optionToUpdate) {
          optionToUpdate.count++;
        }
      });

      // update each option's checked state depending on its counts
      statusSearchCategory.options.forEach(option => {
        option.selected = option.count > 0; // mark checked when count is more than 0
      });
    }
  }

  /**
   * Formats the enum keys to a more user-friendly display format.
   * For example, "RUNNING" becomes "Running", "TIMED_OUT" becomes "Timed Out", etc.
   * @param key - the enum key to format
   * @private
   */
  private formatEnumKeyForDisplay(key: string): string {
    return key
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  /**
   * Signals to open the facet search panel.
   */
  onOpenFacetSearchPanel() {
    this.facetSearchFacade.setIsSearchVisible(true);
  }

  isFacetSearchEnabled(): boolean {
    return this.tasks.length > 0 && !this.isDataLoading && !this.error;
  }

  /**
   * Cancels a running task.
   * @param task
   */
  cancelTask(task: RunInput) {
    this.asyncTaskFacade.cancelTask(task);
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
}
