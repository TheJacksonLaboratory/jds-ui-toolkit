import { ComponentDoc } from '../docs/docs.model';

export const facetSearchDoc: ComponentDoc = {
  name: 'Facet Search',
  slug: 'facet-search',
  category: 'Input',
  status: 'in-progress',
  tags: ['search', 'filter', 'facets'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'FacetSearchComponent',
  description:
    'A slide-in drawer of checkbox-based facet categories for filtering a data set, ' +
    'with live "applied filters" chips that summarize the current selection.',
  variations: [
    {
      id: 'basic',
      title: 'Basic',
      description: 'A facet search panel with a few mock categories; check options to see the applied-filters chips update live.',
      language: 'html',
    },
  ],
  usage: {
    summary:
      'Use FacetSearch to let users filter a list or table by one or more categorical dimensions. ' +
      'It renders as a single, page-level drawer — use exactly one instance per page.',
    dos: [
      'Set config.isToggable when the panel should be dismissible by the user.',
      'Keep category and option labels short so they fit the drawer width.',
    ],
    donts: [
      'Do not render more than one FacetSearch on the same page — its state (visibility, applied filters) is shared app-wide.',
      'Do not mutate categories() options outside of the component’s own selection handlers.',
    ],
  },
  activity: {
    summary: 'Embedded inside AsyncTask to filter tasks by status.',
  },
  theming: [],
};
