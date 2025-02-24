import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// models
import { IAsyncTask } from './models/async-task';
// mock async tasks
import { ASYNC_TASKS_MOCK } from './mock/async-tasks.mock';

@Injectable({
  providedIn: 'root'
})
export class AsyncTasksService {

  constructor() {
    console.log('AsyncTasksService constructed');
  }

  getTasks(): Observable<IAsyncTask[]> {
    return of(ASYNC_TASKS_MOCK).pipe(delay(500));
  }
}
