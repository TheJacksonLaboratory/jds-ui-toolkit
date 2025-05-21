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

    // let t = currentTasks.find(t => t.id === task.id);
    const index = currentTasks.findIndex(t => t.id === task.id);

    if(index === -1) {
      return false;
    } else {
      // t = task;
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
