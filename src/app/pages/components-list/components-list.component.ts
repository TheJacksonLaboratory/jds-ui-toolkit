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
        description: 'AsyncTasks components description',
        isAuthRequired: true,
        status: "In Progress",
        route: 'async-tasks'
      },
      {
        name: 'Authentication',
        description: 'Authentication components description',
        isAuthRequired: false,
        status: "In Progress",
        route: 'authentication'
      },
      {
        name: 'OntologySearch',
        description: 'OntologySearch components description',
        isAuthRequired: false,
        status: "In Progress",
        route: 'ontology-search'
      }
    ];
  }

  ngOnInit() {
    this.uiComponents = this.getUiComponents();
  }
}
