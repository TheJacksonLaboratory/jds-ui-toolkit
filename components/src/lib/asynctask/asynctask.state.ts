import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// models
import { RunInput } from './asynctask.model';

/**
 * State management service for async tasks
 * 
 * Maintains the current state of async tasks and provides methods
 * to update and retrieve task statuses.
 */
@Injectable({
  providedIn: 'root'
})
export class AsyncTaskState {
  private tasks$: BehaviorSubject<RunInput[]> = new BehaviorSubject<RunInput[]>([]);
  // TO-DO: [GIK 6/10/2025] this could be replaced with a specified error structure
  // because there could be more than one error (i.e. when multiple tasks have failed)
  private responseError$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  /**
   * Loads initial RunInput[] tasks
   *
   * @param  RunInput[] array
   */
  setTasks(tasks: RunInput[]): void {
    this.tasks$.next(tasks);
  }

  /**
   * Gets an observable emitting currently available tasks.
   * 
   * @returns RunInput[] observable
   */
  getTasks$(): Observable<RunInput[]> {
    return this.tasks$.asObservable();
  }

  /*
   * Updates a task.
   *
   * @return boolean - true if the task was updated successfully, false otherwise
   */
  updateTask(task: RunInput): boolean {
    const currentTasks: RunInput[] = this.tasks$.getValue();
    const index = currentTasks.findIndex(t => t.id === task.id);

    if(index === -1) {
      return false;
    } else {
      currentTasks[index] = task;

      this.tasks$.next([...currentTasks]);
    }
    return true;
  }

  /**
   * Adds new task to the tasks list or updates an existing task's status.
   * 
   * This method adds a new task only when the task does not alr
   */
  addTask(task: RunInput): boolean {
    const currentTasks = this.tasks$.getValue();
    const t = currentTasks.find(t => t.id === task.id);

    if(!t) {
      // add task entry when it does not exist
      this.tasks$.next([...currentTasks, task]);
    } else {
      return false;
    }
    return true;
  }

  setResponseError(error: string | null): void {
    this.responseError$.next(error);
  }

  getResponseError$(): Observable<string | null> {
    return this.responseError$.asObservable();
  }
}
