import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// models
import { Filter, RunInput } from './asynctask.model';

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
  private filters$: BehaviorSubject<Filter[]> = new BehaviorSubject<Filter[]>([]);
  private activeFilters$: BehaviorSubject<Filter[]> = new BehaviorSubject<Filter[]>([]);


  /**
   * Sets the complete list of task statuses
   * 
   * @param tasks Array of Run objects representing current tasks
   */
  setTasks(tasks: RunInput[]): void {
    this.tasks$.next(tasks);
  }

  /**
   * Gets an observable of the current task statuses
   * 
   * @returns Observable of Run array
   */
  getTasks$(): Observable<RunInput[]> {
    return this.tasks$.asObservable();
  }

  /**
   * Adds new task to the tasks list or updates an existing task's status.
   * 
   * This method adds a new task only when the task does not alr
   */
  addTask(task: RunInput): void {
    const currentTasks = this.tasks$.getValue();
    const index = currentTasks.findIndex(t => t.name === task.name);

    if(index !== -1) {
      // update the task entry in case it already exists
      currentTasks[index] = task;
      this.tasks$.next([...currentTasks]);
    } else {
      // add task entry in case it does not exist
      this.tasks$.next([...currentTasks, task]);
    }
  }

  getFilters$(): Observable<Filter[]> {
    return this.filters$.asObservable();
  }

  setFilters(filters: Filter[]): void {
    this.filters$.next(filters);
  }

  getActiveFilters$(): Observable<Filter[]> {
    return this.activeFilters$.asObservable();
  }

  setActiveFilters(activeFilters: Filter[]): void {
    this.activeFilters$.next(activeFilters);
  }
}
