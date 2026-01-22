import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

interface IComponentDocs {
  name: string;
  description: string;
  isAuthRequired: boolean;
  status: string;
  contact: string;
  docsUrl?: string;
}

@Component({
  selector: 'app-components-list',
  imports: [CommonModule, CardModule, RouterModule, TableModule],
  templateUrl: './component-docs.component.html',
  styleUrl: './component-docs.component.css',
  standalone: true
})
export class ComponentDocsComponent implements OnInit {
  uiComponentDocs: Record<string, IComponentDocs> = {};
  currentComponent: IComponentDocs | null = null;
  currentRouteSegment = '';

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
        name: 'Async Tasks',
        description: 'AsyncTasks components description',
        isAuthRequired: true,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: 'https://jax.org/docs/components/async-tasks',
      },
      authentication: {
        name: 'Authentication',
        description:
          'A reusable Angular component that manages user ' +
          'authentication state and provides a dynamic login/logout interface. ' +
          'The component features a single button that intelligently displays ' +
          '"Login" when the user is unauthenticated and "Logout" when ' +
          'authenticated. It automatically handles authentication state changes, ' +
          "integrates with the application's auth service, and provides " +
          'visual feedback during authentication processes.',
        isAuthRequired: true,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: 'https://jax.org/docs/components/async-tasks',
      },
      'error-widget': {
        name: 'Error Widget',
        description:
          'A reusable Angular component designed to display error ' +
          'messages consistently across applications. This component ' +
          'provides a standardized way to show error states with customizable ' +
          'styling, icons, and messaging. It accepts error text, severity levels ' +
          '(warning, error, critical), and optional action buttons for retry or ' +
          'dismissal functionality.',
        isAuthRequired: false,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: 'https://jax.org/docs/components/async-tasks',
      },
      'facet-search': {
        name: 'Facet Search',
        description:
          'A versatile Angular component that transforms structured data ' +
          'into an interactive faceted search interface. It accepts data ' +
          'arrays and configuration objects to dynamically generate searchable ' +
          'categories and filter options with customizable layouts and ' +
          'presentation styles. The component manages all user interactions ' +
          'including selection, deselection, and multi-select functionality, ' +
          'automatically generating visual chips for active filters. It ' +
          'provides real-time feedback through events and signals to notify ' +
          'parent components of filter changes, enabling seamless integration ' +
          'with search results and data filtering logic.',
        isAuthRequired: false,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: 'https://jax.org/docs/components/async-tasks',
      },
      'ontology-search': {
        name: 'Ontology Search',
        description: 'OntologySearch component description',
        isAuthRequired: false,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: 'https://jax.org/docs/components/async-tasks',
      },
      'progress-widget': {
        name: 'Progress Widget',
        description:
          'Progress widget in progress',
        isAuthRequired: false,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: 'https://jax.org/docs/components/progress-widget',
      },
      'schema-grid': {
        name: 'Schema Based Grid',
        description: 'SchemaGrid component description',
        isAuthRequired: false,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: 'https://jax.org/docs/components/async-tasks',
      },
    };
  }
}
