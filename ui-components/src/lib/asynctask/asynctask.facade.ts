import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// states
import { AsyncTaskState } from './asynctask.state';

// models
import { Filter, RunInput } from './asynctask.model';

// services
import { AsyncTaskService, WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';

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
        this.setUpFilters(runInputs);
      },
      (error) => {
        // TODO: [GIK 4/16/2025] error handling will be implemented in IS-78
        console.error('Error fetching async tasks:', error);
      }
    );
  }

  /**
   * TODO: [GIK 4/16/2025] SSE handling to be implemented in IS-75
   */
  openAsyncTaskEventListener(): void {
    console.log("creates listener to the API's server sent events endpoint");
  }

  addTask(task: RunInput): void {
    this.asyncTaskState.addTask(task);
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

  setUpFilters(tasks: RunInput[]): void {
    const filters: Filter[] = [];
    // Descriptions
    const descriptionFilter: Filter = {
      name: 'Description',
      options: [],
      selectedOptions: [],
    }
    const uniqueDescriptions = new Set(
      tasks.filter((task) =>
            task.description !== null && task.description !== undefined
        ).map((task) => task.description)
    );
    uniqueDescriptions.forEach((description) => {
      if (description) {
        descriptionFilter.options.push({
          label: description,
          value: false,
        });
      }
    });
    filters.push(descriptionFilter)
    // Status
    const statusFilter: Filter = {
      name: 'Status',
      options: [],
      selectedOptions: [],
    }
    for (let i = 0; i < Object.values(WorkflowExecutionStatus).length/2; i++) {
      statusFilter.options.push({
        label: Object.values(WorkflowExecutionStatus)[i] as string,
        value: false,
      })
    }
    filters.push(statusFilter);
    this.asyncTaskState.setFilters(filters);
  }

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

  removeFilter(activeFilters: Filter[], filter: Filter) {
    filter.selectedOptions = [];
    const myActiveFilters = activeFilters.filter((f) => f.name !== filter.name);
    this.setActiveFilters(myActiveFilters);
  }

  clearAllFilters(filters: Filter[]) {
    filters.forEach((filter) => {
      filter.selectedOptions = [];
    });
    this.setActiveFilters([]);
  }
}
