import { Injectable } from '@angular/core';
import {
  forkJoin,
  map,
  switchMap,
  Observable,
  of,
  throwError,
  Subscription,
  BehaviorSubject, retry, timer, concatMap, EMPTY
} from 'rxjs';
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
  ) { }

  /**
   * Fetches async tasks data.
   *
   * The data involves detailed information about task runs including run inputs
   * and statuses (e.g., completed, failed, terminated). The response data is then
   * transformed into the RunInput type and stored in the AsyncTaskState (RxJS) Subject.
   */
  fetchAsyncTasks(): void {
    this.asyncTaskService.getRuns()
      .pipe(
        map(response => response.data as Run[]),
        switchMap((runs: Run[]) => {
          // handle empty runs collection case
          if(runs.length === 0) return of([]);

          return forkJoin(
            runs.map((run: Run) =>
              this.asyncTaskService.getInput(run.input_id).pipe(
                map(inputResponse => inputResponse.object),
                map(input => ({
                  id: run.id,
                  name: input?.name || null,
                  description: input?.description || null,
                  status: run.status
                } as RunInput)),
                // fetching run associated 'input' data errors will still render
                // the view with empty 'name' and 'description', and an info message;
                // runs data (id, status, etc. will still be shown
                catchError(() => of({
                  id: run.id,
                  name: null,
                  description: null,
                  status: run.status,
                  message: `Could not fetch input for run: ${run.id}`
                } as RunInput))
              )
            )
          );
        }),
        // run fetching errors are stored in an observable and managed at
        // the component level (by showing custom toast message)
        catchError(error => {
          // overwrite default error message with a custom, more comprehensible one
          let errorMessage = 'An error occurred while fetching async tasks.';

          switch (error.status) {
            case 400:
              errorMessage = 'Could not fetch async tasks due to a bad request. Please check your request parameters.';
              break;
            case 401:
              errorMessage = 'Could not fetch async tasks due to unauthorized access. Please check your authentication credentials.';
              break;
            case 404:
              errorMessage = 'Could not fetch async tasks because the requested resource was not found.';
              break;
            case 500:
              errorMessage = 'Could not fetch async tasks due to a server error. Please try again later.';
              break;
            default:
              errorMessage = `Unexpected error: ${error.message}`;
          }

          return throwError(() => new Error(errorMessage));
        })
      )
      .subscribe({
        next: (runInputs: RunInput[]) => {
          this.asyncTaskState.setTasks(runInputs);
          // clear any previous error messages
          this.asyncTaskState.setResponseError(null);
        },
        error: (error) => {
          // clear the tasks collection
          this.asyncTaskState.setTasks([]);
          // set the error message
          this.asyncTaskState.setResponseError(error.message);
        }
      });
  }
  /**
   * Fetches event streaming data from the API's server-sent events endpoint.
   *
   * The method returns an observable to the API's server-sent events endpoint and
   * fetches messages that include task updates. The messages are then transformed into
   * RunInput type and stored in the AsyncTaskState.
   */
  openAsyncTasksEventStreaming(accessToken: string): Subscription {
    // return this.asyncTaskService.getRunEvents(accessToken);
    return this.asyncTaskService.getRunEvents(accessToken)
      .pipe(
        retry({
          count: 3,
          delay: (error, retryCount) => {
            return timer(1000 * Math.pow(2, retryCount - 1)); // 1s, 2s, 4s
          }
        }),
        catchError(error => {
          return throwError(() => (`Error fetching event stream: ${error.message}`));
        }),
        concatMap((run: Run) => {
          const existingTasks: RunInput[] =
            (this.asyncTaskState.getTasks$() as BehaviorSubject<RunInput[]>).getValue();
          const existingTask: RunInput | undefined = existingTasks.find(t => t.id === run.id);

          if (existingTask) {
            this.asyncTaskState.updateTask(run);
            return EMPTY; // No further processing needed
          } else {
            return this.asyncTaskService.getInput(run.input_id).pipe(
              map(inputResponse => inputResponse.object),
              map(input => ({
                id: run.id,
                name: input?.name || null,
                description: input?.description || null,
                status: run.status
              } as RunInput)),
              catchError(error => {
                console.error(`Error fetching input for run ${run.id}:`, error);
                return of({
                  id: run.id,
                  name: null,
                  description: null,
                  status: run.status,
                  message: `Could not fetch input for run: ${run.id}`
                } as RunInput);
              })
            );
          }
        })
      ).subscribe({
        next: (runInput) => {
          if(runInput) {
            this.asyncTaskState.addTask(runInput);
          }
        },
        error: (error) => {
          this.asyncTaskState.setResponseError(`Error in event stream: ${error.message}`);
        }
      });
  }


  setTasks(tasks: RunInput[]): void {
    this.asyncTaskState.setTasks(tasks);
  }

  getTasks$(): Observable<RunInput[]> {
    return this.asyncTaskState.getTasks$();
  }

  addTask(task: RunInput): boolean {
    return this.asyncTaskState.addTask(task);
  }

  updateTask(task: RunInput): boolean {
    return this.asyncTaskState.updateTask(task);
  }

  getResponseError$(): Observable<string | null> {
    return this.asyncTaskState.getResponseError$();
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
  filterTasks(tasks: RunInput[], filters: Filter[]): RunInput[] {
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

  deleteTask(task: RunInput): void {
    // this.asyncTaskService.deleteTask(task);
    console.log('Delete task:', task);
  }

  cancelTask(task: RunInput): void {
    // this.asyncTaskService.cancelTask(task);
    console.log('Cancel task:', task);
  }
}
