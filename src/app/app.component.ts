import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';

interface UiComponent {
  name: string;
  description: string;
  route: string;
}

@Component({
  imports: [
    RouterModule,
    TableModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit {
  uiComponents: UiComponent[] = [];

  title = 'jds-ui-components';

  /**
   * Get the UI components to be displayed in the UI
   */
  getUiComponents() {
    return [
      {
        name: 'Authentication',
        description: 'Authentication component',
        route: 'authentication'
      },
      {
        name: 'AsyncTasks',
        description: 'AsyncTasks component',
        route: 'async-tasks'
      }
    ];
  }

  ngOnInit() {
    this.uiComponents = this.getUiComponents();
  }
}