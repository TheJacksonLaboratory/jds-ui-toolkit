import { Component, OnInit, inject } from '@angular/core';

import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

interface IApiClientDocs {
  name: string;
  description: string;
  isAuthRequired: boolean;
  status: string;
  contact: string;
  docsUrl?: string;
}

@Component({
  selector: 'app-client-docs-component',
  imports: [CardModule, RouterModule, TableModule],
  templateUrl: './service-docs.component.html',
  styleUrl: './service-docs.component.css',
  standalone: true
})
export class ServiceDocsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  apiClientDocs: Record<string, IApiClientDocs> = {};
  currentApiClient: IApiClientDocs | null = null;
  currentRouteSegment = '';

  ngOnInit() {
    this.apiClientDocs = this.getApiClients();

    this.loadApiClientByRoute();

    this.router.events.pipe(
      // Use filter to only react to NavigationEnd events
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadApiClientByRoute();
    });
  }

  getLastRouteSegment(): string {
    const segments = this.router.url.split('/');

    return segments.length > 0 ? segments[segments.length - 1] : '';
  }

  loadApiClientByRoute() {
    this.currentRouteSegment = this.getLastRouteSegment();

    if(this.currentRouteSegment && this.apiClientDocs[this.currentRouteSegment]) {
      this.currentApiClient = this.apiClientDocs[this.currentRouteSegment];
    } else {
      this.currentApiClient = null;
    }
  }

  /**
   * Get the UI components list to display in the UI table
   */
  getApiClients() {
    return {
      'isa-data': {
        name: 'ISA Data Service',
        description: 'A service that provides endpoints to retrieve ' +
          'structured (meta)data about scientific experiments. The service fetches ' +
          'hierarchical data on investigations, studies, assays, and measures including ' +
          'biological samples, protocols, and measurement parameters. It manages ' +
          'nested relationships between components to support data management ' +
          'systems and analytical pipelines requiring experimental context.',
        isAuthRequired: false,
        status: 'In Progress',
        contact: 'npm@jax.org',
        docsUrl: ''
      }
    };
  }
}