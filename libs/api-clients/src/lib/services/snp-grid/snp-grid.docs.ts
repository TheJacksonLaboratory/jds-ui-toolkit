import { ServiceDoc } from '../../docs/service-docs.model';

export const snpGridServiceDoc: ServiceDoc = {
  name: 'SNP Grid Service',
  slug: 'snp-grid',
  category: 'Genomics',
  status: 'in-progress',
  tags: ['snps', 'genotypes', 'strains'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'SnpGridService',
  description:
    'Client for the MUSter genotype database — strains, genes, reference SNPs, and genotype ' +
    'query results.',
  usageExamples: [
    {
      id: 'basic',
      title: 'Fetching Strains',
      description: 'Inject the service and request the list of available strains.',
      code: `import { inject } from '@angular/core';
import { SnpGridService } from '@jax-data-science/api-clients';

export class MyComponent {
  private snpGridService = inject(SnpGridService);

  loadStrains() {
    return this.snpGridService.getStrains();
  }
}`,
      language: 'typescript',
    },
  ],
  usage: {
    summary: 'Use SnpGridService to look up strains, genes, and reference SNPs, and to query genotype results.',
    dos: [
      'Validate a gene symbol or rsID with isGeneSymbolValid()/isRSIDValid() before relying on it in a genotype query.',
    ],
    donts: [
      'Do not build download URLs by hand — use getGenotypeDownloadURLForCurrentData().',
    ],
  },
  activity: {
    summary: 'Not yet adopted by any component in this toolkit.',
  },
};
