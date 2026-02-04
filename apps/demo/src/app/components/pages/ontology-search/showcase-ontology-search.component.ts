import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OntologySearchComponent } from '@jax-data-science/components';
import { OLSOntologyService, OntologyService, OntologyTerm, Ontology} from '@jax-data-science/api-clients';
import { DocSectionComponent } from '../../shared/doc-section/doc-section.component';
import { CodeExampleComponent } from '../../shared/code-example/code-example.component';
import { ExampleCardComponent } from '../../shared/example-card/example-card.component';

@Component({
  selector: 'app-ontology-search',
  templateUrl: './showcase-ontology-search.component.html',
  styleUrls: ['./showcase-ontology-search.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OntologySearchComponent,
    DocSectionComponent,
    CodeExampleComponent,
    ExampleCardComponent
  ],
  providers: [
    {
      provide: OntologyService,
      useClass: OLSOntologyService
    }
  ]
})
export class ShowcaseOntologySearchComponent {
  // Example state
  ontology = Ontology.MAXO;
  basicSelected: OntologyTerm[] = [];
  multipleSelected: OntologyTerm[] = [];
  selectedOntology = Ontology.MAXO;
  availableOntologies = [Ontology.HP, Ontology.MAXO, Ontology.MONDO];
  containerWidth = 400;

  // Event handlers
  onBasicSelected(selected: OntologyTerm[]) {
    this.basicSelected = selected;
    console.log('Basic selected:', selected);
  }

  onMultipleSelected(selected: OntologyTerm[]) {
    this.multipleSelected = selected;
    console.log('Multiple selected:', selected);
  }

  onOntologySelected(selected: OntologyTerm[]) {
    console.log('Ontology selected:', selected);
  }

  onResponsiveSelected(selected: OntologyTerm[]) {
    console.log('Responsive selected:', selected);
  }

  switchOntology(ontology: Ontology) {
    this.selectedOntology = ontology;
  }

  // Code examples
  importCode = `import { OntologySearchComponent } from '@jax-data-science/components';
import { OntologyService, OLSOntologyService, Ontology, OntologyTerm } from '@jax-data-science/api-clients';

@Component({
  // ...
  imports: [OntologySearchComponent],
  providers: [
    {
      provide: OntologyService,
      useClass: OLSOntologyService
    }
  ]
})`;

  basicExample = `<lib-ontology-search
  (selected)="onSelected($event)"
  [ontology]="Ontology.MAXO"
  [multiple]="false"
  placeholder="Search MAXO terms...">
</lib-ontology-search>`;

  multipleExample = `<lib-ontology-search
  (selected)="onSelected($event)"
  [ontology]="Ontology.MAXO"
  [multiple]="true"
  placeholder="Search and select multiple terms...">
</lib-ontology-search>`;

  ontologyExample = `<lib-ontology-search
  (selected)="onSelected($event)"
  [ontology]="selectedOntology"
  [multiple]="false"
  [placeholder]="'Search ' + selectedOntology + ' terms...'">
</lib-ontology-search>

// In component:
selectedOntology = Ontology.HP;
availableOntologies = [Ontology.HP, Ontology.MAXO, Ontology.MONDO];`;

  responsiveExample = `<!-- Container width controls responsive behavior -->
<div [style.width.px]="containerWidth">
  <lib-ontology-search
    (selected)="onSelected($event)"
    [ontology]="Ontology.MAXO"
    [multiple]="true"
    placeholder="Try hovering on options...">
  </lib-ontology-search>
</div>

<!-- Below 500px: Chips hide on hover to show full text -->
<!-- Above 500px: Chips remain visible -->`;

  typesCode = `interface OntologyTerm {
  id: string;        // Ontology term ID (e.g., "HP:0001250")
  name: string;      // Human-readable term name
  // ... additional properties
}

enum Ontology {
  HP = 'HP',         // Human Phenotype Ontology
  MAXO = 'MAXO',     // Medical Action Ontology
  MONDO = 'MONDO',   // Monarch Disease Ontology
  // ... other ontologies
}`;

  cssVariablesCode = `:root {
  /* Primary colors */
  --echo-slate-800: #1e293b;
  --echo-slate-100: #f1f5f9;
  --echo-cyan-700: #0e7490;

  /* Or override in your component styles */
}

lib-ontology-search {
  /* Custom color overrides */
  --echo-slate-800: #your-color;
  --echo-cyan-700: #your-accent;
}`;

  containerQueryCode = `/* Automatic responsive behavior - no configuration needed */
@container ontology-search (max-width: 499px) {
  .ontology-option__chip {
    /* Chips hide on hover when narrow */
    transition: max-width 180ms ease, opacity 180ms ease;
  }
}`;

  providerCode = `import { OntologyService, OLSOntologyService } from '@jax-data-science/api-clients';

@Component({
  // ...
  providers: [
    {
      provide: OntologyService,
      useClass: OLSOntologyService  // or JaxOntologyService
    }
  ]
})`;

  // API Documentation
  apiInputs = [
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Enable multi-select mode with checkboxes'
    },
    {
      name: 'ontology',
      type: 'Ontology',
      default: 'Ontology.HP',
      description: 'The ontology to search (HP, MAXO, MONDO, etc.)'
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Search ontology terms...'",
      description: 'Placeholder text for the search input'
    },
    {
      name: 'extended',
      type: 'boolean',
      default: 'false',
      description: 'Enable extended features (footer template)'
    },
    {
      name: 'max_results',
      type: 'number',
      default: '25',
      description: 'Maximum number of search results to display'
    }
  ];

  apiOutputs = [
    {
      name: 'selected',
      type: 'EventEmitter<OntologyTerm[]>',
      description: 'Emits when terms are selected or deselected. Always returns an array, even in single-select mode.'
    }
  ];
}