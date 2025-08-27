import { Component } from '@angular/core';
import { OntologySearchComponent } from '@jax-data-science/components';
import { JaxOntologyService, OLSOntologyService, OntologyService, OntologyTerm, Ontology} from '@jax-data-science/api-clients';
@Component({
  selector: 'app-ontology-search',
  templateUrl: './showcase-ontology-search.component.html',
  styleUrls: ['./showcase-ontology-search.component.css'],
  standalone: true,
  imports: [OntologySearchComponent],
  providers: [
    {
      provide: OntologyService,
      useClass: OLSOntologyService // Use the OLSOntologyService for ontology operations
    }
  ]
})
export class ShowcaseOntologySearchComponent {
  ontology = Ontology.MAXO; // Ontology to use
  onSelected(selected: OntologyTerm[]) {
    // Handle selected ontology terms here
    console.log('Selected terms:', selected);
  }
}