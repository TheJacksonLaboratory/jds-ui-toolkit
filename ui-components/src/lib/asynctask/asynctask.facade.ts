import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// states
import { AsyncTaskState } from './asynctask.state';

// models
import { Run } from '@jax-data-science-demo/api-clients';

// services
import { AsyncTaskService } from '@jax-data-science-demo/api-clients';

@Injectable({
  providedIn: 'root'
})
export class AsyncTaskFacade {
  constructor(
    private asyncTaskState: AsyncTaskState,
    private asyncTaskService: AsyncTaskService
  ) { }

  openAsyncTasksEventsListener(): void {
    console.log("creates listener to the API's server sent events endpoint");

    this.asyncTaskService.getRuns().subscribe((tasks) => {
      tasks.data.forEach((task) => {
        this.addTask(task);
      });
    });
  }

  addTask(task: Run): void {
    this.asyncTaskState.addTask(task);
  }

  getTasks$(): Observable<Run[]> {
    return this.asyncTaskState.getTasks$();
  }
}