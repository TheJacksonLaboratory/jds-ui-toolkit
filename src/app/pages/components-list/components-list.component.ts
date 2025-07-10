import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PrimeNG
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';

interface UiComponent {
  name: string;
  description: string;
  isAuthRequired: boolean;
  route: string;
}

@Component({
  selector: 'app-components-list',
  imports: [CommonModule, PrimeTemplate, RouterModule, TableModule],
  templateUrl: './components-list.component.html',
  styleUrl: './components-list.component.css',
  standalone: true
})
export class ComponentsListComponent implements OnInit {
  uiComponents: UiComponent[] = [];

  /**
   * Get the UI components list to display in the UI table
   */
  getUiComponents() {
    return [
      {
        name: 'AsyncTasks',
        description: 'AsyncTasks component description',
        isAuthRequired: true,
        status: "In Progress",
        route: 'async-tasks'
      },
      {
        name: 'Authentication',
        description: 'Authentication component description',
        isAuthRequired: false,
        status: "In Progress",
        route: 'authentication'
      },
      {
        name: 'FacetSearch',
        description: 'FacetSearch component description',
        isAuthRequired: false,
        status: "Completed",
        route: 'facet-search'
      }
    ];
  }

  ngOnInit() {
    this.uiComponents = this.getUiComponents();
  }
}