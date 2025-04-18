import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { TableModule } from 'primeng/table';
// facades
import { AsyncTasksFacade } from './async-tasks.facade';
// models
import { IAsyncTask } from '@jds-angular/api-clients';

@Component({
  selector: 'lib-jds-async-tasks',
  imports: [CommonModule, TableModule],
  templateUrl: './async-tasks.component.html',
  styleUrl: './async-tasks.component.css',
  standalone: true,
})
export class AsyncTasksComponent implements OnInit {
  tasks: IAsyncTask[] = [];

  constructor(private asyncTasksFacade: AsyncTasksFacade) {
    console.log('AsyncTasksComponent constructed');
  }
  ngOnInit() {
    this.asyncTasksFacade.openAsyncTasksEventsListener();

    this.asyncTasksFacade.getRunStatuses$().subscribe(
      (tasks) => {
        this.tasks = tasks;
        console.log('tasks', tasks);
    });

    console.log('AsyncTasksComponent initialized');
  }
}
