import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { TableModule } from 'primeng/table';
// facades
import { AsyncTaskFacade } from './asynctask.facade';
// models
import { IAsyncTask } from '@jax-data-science-demo/api-clients';

@Component({
  selector: 'lib-jds-async-tasks',
  imports: [CommonModule, TableModule],
  templateUrl: './asynctask.component.html',
  styleUrl: './asynctask.component.css',
  standalone: true,
})
export class AsyncTaskComponent implements OnInit {
  tasks: IAsyncTask[] = [];

  constructor(private asyncTaskFacade: AsyncTaskFacade) {
    console.log('AsyncTaskComponent constructed');
  }
  ngOnInit() {
    this.asyncTaskFacade.openAsyncTasksEventsListener();

    this.asyncTaskFacade.getRunStatuses$().subscribe(
      (tasks) => {
        this.tasks = tasks;
        console.log('tasks', tasks);
    });

    console.log('AsyncTaskComponent initialized');
  }
}
