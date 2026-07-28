import { ServiceDoc } from '../../docs/service-docs.model';

export const mvarServiceDoc: ServiceDoc = {
  name: 'MVar Service',
  slug: 'mvar',
  category: 'Genomics',
  status: 'in-progress',
  tags: ['variants', 'snps', 'sequence-ontology'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'MVarService',
  description:
    'Client for the MVAR variant database — queries genomic variants for a set of SNP ' +
    'regions and resolves their functional classes against sequence ontology terms.',
  usageExamples: [
    {
      id: 'basic',
      title: 'Fetching Variants',
      description: 'Inject the service and request variants for a set of SNP regions.',
      code: `import { inject } from '@angular/core';
import { MVarService } from '@jax-data-science/api-clients';

export class MyComponent {
  private mvarService = inject(MVarService);

  loadVariants(regions, pageStart, pageEnd) {
    return this.mvarService.getVariants(regions, pageStart, pageEnd, 'mm10');
  }
}`,
      language: 'typescript',
    },
  ],
  usage: {
    summary: 'Use MVarService to fetch variant data for SNP regions currently visible in a genotype table.',
    dos: [
      'Pass only the regions actually displayed on the current page — use getRegionsToRequestVariantsFor() to compute them from the full requested range.',
    ],
    donts: [
      'Do not request variants for every SNP region up front; page-scope the request to what\'s currently displayed.',
    ],
  },
  activity: {
    summary: 'Not yet adopted by any component in this toolkit.',
  },
};
