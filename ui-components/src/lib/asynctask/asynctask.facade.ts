import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// states
import { AsyncTaskState } from './asynctask.state';

// models
import { RunInput } from './asynctask.model';

// services
import { AsyncTaskService, Run } from '@jax-data-science-demo/api-clients';

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

  addTask(task: RunInput): void {
    this.asyncTaskState.addTask(task);
  }

  getTasks$(): Observable<RunInput[]> {
    return this.asyncTaskState.getTasks$();
  }
}