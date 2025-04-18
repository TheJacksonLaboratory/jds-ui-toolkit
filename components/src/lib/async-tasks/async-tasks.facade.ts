import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// states
import { AsyncTasksState } from './async-tasks.state';

// models
import { IAsyncTask } from '@jds-angular/api-clients';

// services
import { AsyncTasksService } from '@jds-angular/api-clients';

@Injectable({
  providedIn: 'root'
})
export class AsyncTasksFacade {
  constructor(
    private asyncTasksState: AsyncTasksState,
    private asyncTasksService: AsyncTasksService
  ) { }

  openAsyncTasksEventsListener(): void {
    console.log("creates listener to the API's server sent events endpoint");

    this.asyncTasksService.getTasks().subscribe((tasks) => {
      tasks.forEach((task) => {
        this.addStatus(task);
      });
    });
  }

  addStatus(status: IAsyncTask): void {
    this.asyncTasksState.addStatus(status);
  }

  getRunStatuses$(): Observable<IAsyncTask[]> {
    return this.asyncTasksState.getStatuses$();
  }
}
