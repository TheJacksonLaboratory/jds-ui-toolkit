import { ComponentDoc } from '../docs/docs.model';

export const autocompleteDoc: ComponentDoc = {
  name: 'Autocomplete',
  slug: 'autocomplete',
  category: 'Input',
  status: 'in-progress',
  tags: ['search', 'typeahead', 'suggestions', 'input'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'JdsAutocompleteComponent',
  description:
    'A search-as-you-type input built on PrimeNG AutoComplete. Suggestions can be ' +
    'flat or grouped by section, matched characters are highlighted, and the panel ' +
    'caps results (4 per group, 8 total) with an optional "Show all N results" ' +
    'footer for server-side result sets.',
  docsUrl: 'https://jax.org/docs/components/autocomplete',
  // Code snippets are generated from the live demo templates (`pnpm docs:snippets`),
  // keyed by variation id. No hand-authored `code` needed.
  variations: [
    {
      id: 'grouped',
      title: 'Grouped Suggestions',
      description:
        'Suggestions grouped into sections (Phenotypes, Diseases, Genes). ' +
        'Providing totalCount adds the "Show all results" footer.',
      language: 'html',
    },
    {
      id: 'flat',
      title: 'Flat Suggestions',
      description: 'The same component fed a flat array — no section headers are rendered.',
      language: 'html',
    },
    {
      id: 'truncation',
      title: 'Truncation in a Narrow Container',
      description:
        'Labels and secondary ids ellipsis-truncate to fit the parent width; the ' +
        'component fills whatever container it is placed in.',
      language: 'html',
    },
  ],
  usage: {
    summary:
      'Use Autocomplete when users need to find a known entity from a large set by ' +
      'typing part of its name or id. Fetch matches in the completeMethod handler ' +
      '(debounced by delay) and feed them back through suggestions.',
    dos: [
      'Fetch suggestions in the completeMethod handler and set them via the suggestions input.',
      'Group results by type when the source spans multiple entity kinds.',
      'Set totalCount when more matches exist server-side than the panel shows, and handle showAll.',
    ],
    donts: [
      'Do not pre-load thousands of items into suggestions — filter server-side and rely on minLength/delay.',
      'Do not mix grouped and flat shapes in the same suggestions array.',
      'Do not rely on the panel to show every match — it caps at 4 per group and 8 total by design.',
    ],
  },
  activity: {
    summary:
      'Introduced for entity search across phenotype, disease, and gene lookups. ' +
      'Track adoption and reported issues here as the component matures toward a stable release.',
  },
  // Properties (inputs/outputs) come from the Compodoc-generated map,
  // COMPONENT_PROPERTIES, keyed by compodocSymbol. See `pnpm docs:properties`.
  theming: [
    {
      variable: '--echo-autocomplete-option-focus-background',
      default: 'var(--echo-cyan-700, #0177b2)',
      description: 'Background of a suggestion row while keyboard-focused or hovered.',
    },
    {
      variable: '--echo-autocomplete-option-focus-color',
      default: 'var(--echo-grey-0, #ffffff)',
      description: 'Text color of a suggestion row while keyboard-focused or hovered.',
    },
  ],
};
