import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsyncTasksComponent } from '@jds-angular/components'

@Component({
  selector: 'app-showcase-async-tasks',
  imports: [CommonModule, AsyncTasksComponent],
  templateUrl: './showcase-async-tasks.component.html',
  styleUrl: './showcase-async-tasks.component.css',
  standalone: true
})
export class ShowcaseAsyncTasksComponent {}
