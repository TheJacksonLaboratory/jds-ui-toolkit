import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JaxOntologyService, OLSOntologyService, Ontology } from '@jax-data-science/api-clients';
import { ontologyDoc } from '@jax-data-science/service-docs';
import { DocOverviewComponent } from '../../../docs-shell/tab-content/doc-overview/doc-overview.component';
import { DocUsageComponent } from '../../../docs-shell/tab-content/doc-usage/doc-usage.component';
import { DocActivityComponent } from '../../../docs-shell/tab-content/doc-activity/doc-activity.component';

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

  jaxResults$ = this.jaxOntology.search('fever', 5, Ontology.HP);
  olsResults$ = this.olsOntology.search('fever', 5, Ontology.HP);
}
