import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// states
import { AsyncTaskState } from './asynctask.state';

// models
import { Filter, RunInput } from './asynctask.model';

// services
import { AsyncTaskService, Run, WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';

import { IFilterConfig } from './asynctask.component';

@Injectable({
  providedIn: 'root'
})
export class AsyncTaskFacade {
  constructor(
    private asyncTaskState: AsyncTaskState,
    private asyncTaskService: AsyncTaskService
  ) {
    asyncTaskService.setBaseUrl('https://astra-dev.jax.org');
  }


  /**
   * Fetches historical async tasks data.
   *
   * The data involves detailed information about completed tasks runs including
   * their inputs and statuses (e.g., completed, failed, terminated). The response
   * is then transformed into the RunInput type and stored in the AsyncTaskState.
   */
  fetchAsyncTasks(): void {
    forkJoin({
      runs: this.asyncTaskService.getRuns().pipe(
        catchError((error) => {
          return of({ data: [] }); // returns empty array
        })
      ),
      inputs: this.asyncTaskService.getInputs().pipe(
        catchError((error) => {
          return of({ data: [] }); // returns empty array
        })
      )
    }).subscribe(
      ({runs, inputs}) => {
        const runInputs: RunInput[] = runs.data.map(run => {
          // find the matching input
          const matchingInput = inputs.data.find(input => input.id === run.input_id);

          // creates RunInput object
          return {
            id: run.id,
            name: matchingInput?.name ?? '',
            description: matchingInput?.description ?? '',
            status: run.status,
          };
        });

        this.asyncTaskState.setTasks(runInputs);
      },
      (error) => {
        // TODO: [GIK 4/16/2025] error handling will be implemented in IS-78
        console.error('Error fetching async tasks:', error);
      }
    );
  }

  /**
   * Fetches event streaming data from the API's server-sent events endpoint.
   *
   * The method returns an observable  to the API's server-sent events endpoint and
   * fetches messages that include task updates. The messages are then transformed into
   * RunInput type and stored in the AsyncTaskState.
   */
  openAsyncTasksEventStreaming(accessToken: string): Observable<Run> {
    return this.asyncTaskService.getRunEvents(accessToken);
  }

  addTask(task: RunInput): boolean {
    return this.asyncTaskState.addTask(task);
  }

  updateTask(task: RunInput): boolean {
    return this.asyncTaskState.updateTask(task);
  }

  getTasks$(): Observable<RunInput[]> {
    return this.asyncTaskState.getTasks$();
  }

  getFilters$(): Observable<Filter[]> {
    return this.asyncTaskState.getFilters$();
  }

  setFilters(filters: Filter[]): void {
    this.asyncTaskState.setFilters(filters);
  }

  getActiveFilters$(): Observable<Filter[]> {
    return this.asyncTaskState.getActiveFilters$();
  }

  setActiveFilters(filters: Filter[]): void {
    this.asyncTaskState.setActiveFilters(filters);
  }

  /**
   * Sets up filters for the AsyncTask table. Status is the only default filter. The rest are defined in the tableConfig.filterConfigs array.
   * @param filterConfigs
   */
  setUpFilters(filterConfigs?: IFilterConfig[]): void {
    const filters: Filter[] = [];

    // Status
    const statusFilter: Filter = {
      name: 'Status',
      options: [],
      selectedOptions: [],
    }
    for (let i = 0; i < Object.values(WorkflowExecutionStatus).length/2; i++) {
      statusFilter.options.push({
        label: Object.values(WorkflowExecutionStatus)[i] as string
      })
    }
    filters.push(statusFilter);

    // Config filters
    if (filterConfigs) {
      filterConfigs.forEach(filterConfig => {
        const filter: Filter = {
          name: filterConfig.displayName,
          options: filterConfig.filterOptions.map(option => ({label: option})),
          selectedOptions: [],
        }
        filters.push(filter);
      });
    }

    this.asyncTaskState.setFilters(filters);
  }

  /**
   * Filters tasks based on the selected options in the filters.
   * @param tasks
   * @param filters
   */
  filterTasks(tasks: RunInput[], filters: Filter[]) {
    return tasks.filter((task) => {
      for (const filter of filters) {
        const selectedOptions = filter.selectedOptions.map(option => option.label);
        if (filter.name === 'Status') {
          if (!selectedOptions.includes(WorkflowExecutionStatus[task.status])) {
            return false;
          }
        } else {
          if (!selectedOptions.includes(task[filter.name.toLowerCase() as keyof RunInput] as string)) {
            return false;
          }
        }
      }
      // if all filters are satisfied, return true
      return true;
    });
  }

  /**
   * Removes a filter from the active filters list and clears its selected options.
   * @param activeFilters
   * @param filter
   */
  removeFilter(activeFilters: Filter[], filter: Filter) {
    filter.selectedOptions = [];
    const newActiveFilters = activeFilters.filter((f) => f.name !== filter.name);
    this.setActiveFilters(newActiveFilters);
  }

  /**
   * Clears all selected options in the filters and sets the active filters to an empty array.
   * @param filters
   */
  clearAllFilters(filters: Filter[]) {
    filters.forEach((filter) => {
      filter.selectedOptions = [];
    });
    this.setActiveFilters([]);
  }
}
