import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';

interface IComponentDocs {
  name: string;
  description: string;
  isAuthRequired: boolean;
}

@Component({
  selector: 'app-components-list',
  imports: [CommonModule, CardModule, PrimeTemplate, RouterModule, TableModule],
  templateUrl: './component-docs.component.html',
  styleUrl: './component-docs.component.css',
  standalone: true
})
export class ComponentDocsComponent implements OnInit {
  uiComponentDocs: Record<string, IComponentDocs> = {};
  currentComponent: IComponentDocs | null = null;
  currentRouteSegment: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.uiComponentDocs = this.getUiComponents();

    this.loadComponentByRoute();

    this.router.events.pipe(
      // Use filter to only react to NavigationEnd events
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadComponentByRoute();
    });
  }

  getLastRouteSegment(): string {
    const segments = this.router.url.split('/');

    return segments.length > 0 ? segments[segments.length - 1] : '';
  }

  loadComponentByRoute() {
    this.currentRouteSegment = this.getLastRouteSegment();

    if(this.currentRouteSegment && this.uiComponentDocs[this.currentRouteSegment]) {
      this.currentComponent = this.uiComponentDocs[this.currentRouteSegment];
    } else {
      this.currentComponent = null;
    }
    console.log(this.currentComponent);
  }

  /**
   * Get the UI components list to display in the UI table
   */
  getUiComponents() {
    return {
      'async-tasks': {
        name: 'AsyncTasks',
        description: 'AsyncTasks components description',
        isAuthRequired: true
      },
      'authentication': {
        name: 'Authentication',
        description: 'Authentication components description',
        isAuthRequired: false
      },
      'error-widget': {
        name: 'ErrorWidget',
        description: 'ErrorWidget component description',
        isAuthRequired: false
      },
      'facet-search': {
        name: 'FacetSearch',
        description: 'FacetSearch component description',
        isAuthRequired: false
      },
      'ontology-search': {
        name: 'OntologySearch',
        description: 'OntologySearch component description',
        isAuthRequired: false
      },
      'schema-grid': {
        name: 'SchemaGrid',
        description: 'SchemaGrid component description',
        isAuthRequired: false
      }
    };
  }
}
