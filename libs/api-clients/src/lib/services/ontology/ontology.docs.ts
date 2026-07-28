import { ServiceDoc } from '../../docs/service-docs.model';

export const ontologyDoc: ServiceDoc = {
  name: 'Ontology Service',
  slug: 'ontology',
  category: 'Ontology',
  status: 'in-progress',
  tags: ['ontology', 'search', 'terms'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'OntologyService',
  description:
    'Search and traverse biomedical ontology terms (HP, MONDO, MP, CL, MAXO). ' +
    'Two interchangeable implementations are available, hitting different real backends.',
  usageExamples: [
    {
      id: 'jax-ontology',
      title: 'Using JaxOntologyService',
      description:
        'Hits JAX’s own ontology-service backend, configured from a remote JSON config fetched on construction.',
      code: `import { inject } from '@angular/core';
import { JaxOntologyService, Ontology } from '@jax-data-science/api-clients';

export class MyComponent {
  private ontologyService = inject(JaxOntologyService);

  searchHpo(query: string) {
    return this.ontologyService.search(query, 10, Ontology.HP);
  }
}`,
      language: 'typescript',
    },
    {
      id: 'ols-ontology',
      title: 'Using OLSOntologyService',
      description: 'Hits EBI’s public OLS (Ontology Lookup Service) API directly — no config needed.',
      code: `import { inject } from '@angular/core';
import { OLSOntologyService, Ontology } from '@jax-data-science/api-clients';

export class MyComponent {
  private ontologyService = inject(OLSOntologyService);

  searchHpo(query: string) {
    return this.ontologyService.search(query, 10, Ontology.HP);
  }
}`,
      language: 'typescript',
    },
  ],
  usage: {
    summary:
      'Inject whichever OntologyService implementation matches the backend you need; ' +
      'both honor the same contract.',
    dos: [
      'Prefer JaxOntologyService for JAX-curated ontology data.',
      'Use OLSOntologyService when you need EBI-hosted ontologies not mirrored by JAX.',
    ],
    donts: [
      'Do not assume paging shape is identical between implementations — OLS-specific paging fields differ from JAX’s.',
    ],
  },
  activity: {
    summary: 'New — not yet adopted by any component in this toolkit. Demoed here to establish the services docs pattern.',
  },
};
