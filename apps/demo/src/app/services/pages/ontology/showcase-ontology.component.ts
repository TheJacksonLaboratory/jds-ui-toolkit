import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, defer, of } from 'rxjs';
import { JaxOntologyService, OLSOntologyService, Ontology } from '@jax-data-science/api-clients';
import { ontologyDoc } from '@jax-data-science/service-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

const EMPTY_RESULTS = { data: [], paging: { page: 1, total_pages: 0, total_items: 0 } };

@Component({
  selector: 'app-showcase-ontology',
  imports: [CommonModule, DocOverviewComponent, DocUsageComponent, DocActivityComponent],
  templateUrl: './showcase-ontology.component.html',
  styleUrl: './showcase-ontology.component.css',
  standalone: true,
})
export class ShowcaseOntologyComponent {
  private jaxOntology = inject(JaxOntologyService);
  private olsOntology = inject(OLSOntologyService);
  readonly doc = ontologyDoc;

  readonly jaxError = signal<string | null>(null);
  readonly olsError = signal<string | null>(null);

  // `defer` delays calling search() until subscription time, so a real
  // backend failure surfaces as an observable error instead of throwing
  // during component construction.
  jaxResults$ = defer(() => this.jaxOntology.search('fever', 5, Ontology.HP)).pipe(
    catchError((error) => {
      this.jaxError.set(error?.message ?? 'Request to the JAX ontology backend failed.');
      return of(EMPTY_RESULTS);
    })
  );

  olsResults$ = defer(() => this.olsOntology.search('fever', 5, Ontology.HP)).pipe(
    catchError((error) => {
      this.olsError.set(error?.message ?? 'Request to the OLS ontology backend failed.');
      return of(EMPTY_RESULTS);
    })
  );
}
