import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// models
import { Run } from '@jax-data-science-demo/api-clients';

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
  private tasks$: BehaviorSubject<Run[]> = new BehaviorSubject<Run[]>([]);

  /**
   * Sets the complete list of task statuses
   * 
   * @param tasks Array of Run objects representing current tasks
   */
  setTasks(tasks: Run[]): void {
    this.tasks$.next(tasks);
  }

  /**
   * Gets an observable of the current task statuses
   * 
   * @returns Observable of Run array
   */
  getTasks$(): Observable<Run[]> {
    return this.tasks$.asObservable();
  }

  /**
   * Adds new task or updates existing task status
   * 
   * This method adds a new task only when the task does not exist,
   * otherwise it updates the existing task's status.
   *
   * @param task Run object to be added or updated
   */
  addTask(task: Run): void {
    const currentTasks = this.tasks$.getValue();
    const index = currentTasks.findIndex(t => t.id === task.id);

    if(index !== -1) {
      // update the task entry in case it already exists
      currentTasks[index] = task;
      this.tasks$.next([...currentTasks]);
    } else {
      // add task entry in case it does not exist
      this.tasks$.next([...currentTasks, task]);
    }
  }
}