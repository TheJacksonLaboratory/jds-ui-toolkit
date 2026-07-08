import { ServiceDoc } from '../../docs/service-docs.model';

export const isaDataDoc: ServiceDoc = {
  name: 'ISA Data',
  slug: 'isa-data',
  category: 'Data Access',
  status: 'in-progress',
  tags: ['isa', 'metadata', 'studies'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'ISADataService',
  description:
    'Fetches ISA (Investigation-Study-Assay) measure series metadata and characteristics ' +
    'for a given study.',
  usageExamples: [
    {
      id: 'basic',
      title: 'Fetching Measure Series Metadata',
      description:
        'Inject the service and request metadata for a measure series within a study. ' +
        'Only a single measure series ID and study ID are currently supported.',
      code: `import { inject } from '@angular/core';
import { ISADataService } from '@jax-data-science/api-clients';

export class MyComponent {
  private isaDataService = inject(ISADataService);

  loadMetadata(measureSeriesId: string, studyId: string) {
    return this.isaDataService.getMeasureSeriesMetadata([measureSeriesId], [studyId]);
  }
}`,
      language: 'typescript',
    },
  ],
  usage: {
    summary: 'Use ISADataService to look up measure series metadata and characteristics for a study.',
    dos: [
      'Pass exactly one measure series ID and one study ID — only single-ID lookups are currently supported.',
    ],
    donts: [
      'Do not call getMeasuresMetadata() — it is a placeholder for future API growth and always returns an empty response today.',
    ],
  },
  activity: {
    summary: 'Used by the legacy ISA Data services page while this section is being built out.',
  },
};
