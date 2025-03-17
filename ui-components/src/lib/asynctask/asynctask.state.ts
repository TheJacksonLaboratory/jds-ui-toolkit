import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// models
import { IAsyncTask } from '@jax-data-science-demo/api-clients';


@Injectable({
  providedIn: 'root'
})
export class AsyncTaskState {
  private statuses$: BehaviorSubject<IAsyncTask[]> = new BehaviorSubject<IAsyncTask[]>([]);

  setStatuses(statuses: IAsyncTask[]): void {
    this.statuses$.next(statuses);
  }

  getStatuses$(): Observable<IAsyncTask[]> {
    return this.statuses$.asObservable();
  }

  /**
   * adds new task status only when the async task does not exist, otherwise updates the existing task's status
   *
   * @param status IAsyncTask entry to be added
   */
  addStatus(status: IAsyncTask): void {
    const currentStatuses = this.statuses$.getValue();
    const index = currentStatuses.findIndex(s => s.id === status.id);

    if(index !== -1) {
      // update the status entry in case it already exists
      currentStatuses[index] = status;
      this.statuses$.next(currentStatuses);
      return;
    } else {
      // add status entry in case it does not exist
      this.statuses$.next([...currentStatuses, status]);
    }
  }
}