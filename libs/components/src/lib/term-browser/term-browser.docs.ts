import { ComponentDoc } from '../docs/docs.model';

export const termBrowserDoc: ComponentDoc = {
  name: 'Term Browser',
  slug: 'term-browser',
  category: 'Data Display',
  status: 'in-progress',
  tags: ['ontology', 'tree', 'hierarchy', 'terms'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'JdsTermBrowserComponent',
  description:
    'A tree of where a term sits in an ontology. An ontology is a graph rather than a ' +
    'tree, so a term reachable by several routes is rendered once per route, each ' +
    'occurrence carrying its own subtree. Children load on expansion through a resolver ' +
    'the consumer supplies, which keeps the component free of any ontology client.',
  variations: [
    {
      id: 'polyhierarchy',
      title: 'A term on several routes',
      description:
        'Arachnodactyly has fifteen ancestors reached over eight distinct routes, which ' +
        'renders as thirty-seven rows across sixteen terms. Selecting it highlights all ' +
        'eight positions, because selection follows the term; collapsing one leaves the ' +
        'others open, because expansion follows the route.',
      language: 'html',
    },
    {
      id: 'single-path',
      title: 'A term on one route, with children',
      description:
        'Hypertension is reached one way, so nothing repeats. Its descendant count is ' +
        'non-zero, so it carries a twisty; expanding it calls the resolver once and ' +
        'caches the result.',
      language: 'html',
    },
    {
      id: 'narrow',
      title: 'In a narrow rail',
      description:
        'The same tree in a 284px container, the width of HPO’s left rail. Indentation ' +
        'steps down and labels truncate rather than overflowing.',
      language: 'html',
    },
  ],
  usage: {
    summary:
      'Use the Term Browser to show where a term sits in a hierarchy and to let someone ' +
      'walk it. Build the tree with buildTermTree from the api-clients library, or let ' +
      'JdsTermBrowserFacade do it from any OntologyService implementation.',
    dos: [
      'Supply childrenResolver — without it a term with descendants has a twisty that does nothing.',
      'Resolve the term through the backend first and use the id it returns, since an ontology may replace a term and answer to its old id.',
      'Let descendantCount reach the component, as it decides which rows can expand without a speculative request.',
    ],
    donts: [
      'Do not merge the tree by term id — that fabricates edges the ontology does not have and loses which route was taken.',
      'Do not key expansion state on the term id, or collapsing one occurrence collapses every other one too.',
      'Do not re-root the tree on selection unless that is what you want; set reFocusOnSelect, which defaults to false.',
    ],
  },
  activity: {
    summary:
      'Built for HPO’s term navigation and intended for any ontology the toolkit’s ' +
      'clients can reach.',
  },
  theming: [
    { variable: '--jds-term-browser-background', default: 'var(--p-surface-0, #ffffff)', description: 'Card background.' },
    { variable: '--jds-term-browser-title-color', default: 'var(--p-text-color, #1e293b)', description: 'Heading colour.' },
    { variable: '--jds-term-browser-label-color', default: 'var(--p-text-color, #222222)', description: 'Term name colour.' },
    { variable: '--jds-term-browser-muted-color', default: 'var(--p-text-muted-color, #454545)', description: 'Descendant count and empty-state colour.' },
    { variable: '--jds-term-browser-twisty-color', default: 'var(--p-text-muted-color, #636363)', description: 'Expand and collapse chevron colour.' },
    { variable: '--jds-term-browser-selected-background', default: 'var(--p-highlight-background, #94e1dc)', description: 'Background of every row holding the selected term.' },
    { variable: '--jds-term-browser-selected-color', default: 'var(--p-highlight-color, #16191d)', description: 'Text colour on a selected row.' },
    { variable: '--jds-term-browser-focus-ring-color', default: 'var(--p-primary-color, #0177b2)', description: 'Keyboard focus ring.' },
    { variable: '--jds-term-browser-radius', default: 'var(--p-content-border-radius, 6px)', description: 'Row corner radius.' },
    { variable: '--jds-term-indent', default: '1rem', description: 'Indentation per level; steps down to 0.5rem under a 20rem container.' },
  ],
};
