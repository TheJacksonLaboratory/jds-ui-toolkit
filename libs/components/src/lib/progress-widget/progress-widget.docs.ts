import { ComponentDoc } from '../docs/docs.model';

export const progressWidgetDoc: ComponentDoc = {
  name: 'Progress Widget',
  slug: 'progress-widget',
  category: 'Utilities',
  status: 'in-progress',
  tags: ['loading', 'spinner', 'feedback'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'ProgressWidgetComponent',
  description:
    'A reusable Angular component that displays a loading spinner and an optional ' +
    'dynamic status message. Supports customizable spinner sizes (rem), optional ' +
    'icon decoration, and a full-screen BlockUI overlay to prevent user interaction ' +
    'during async operations.',
  docsUrl: 'https://jax.org/docs/components/progress-widget',
  // Code snippets are generated from the live demo templates (`pnpm docs:snippets`),
  // keyed by variation id. No hand-authored `code` needed.
  variations: [
    {
      id: 'basic-spinner',
      title: 'Basic Spinner',
      description: 'Minimal 1rem spinner with no message.',
      language: 'html',
    },
    {
      id: 'with-message',
      title: 'Spinner with Message',
      description: '3rem spinner with a static status message.',
      language: 'html',
    },
    {
      id: 'dynamic-message',
      title: 'Dynamic Message',
      description: 'Default 5rem spinner whose message and loading state are bound to component properties.',
      language: 'html',
    },
    {
      id: 'with-icon',
      title: 'With Icon',
      description: 'Spinner paired with a PrimeIcons icon class for contextual feedback.',
      language: 'html',
    },
    {
      id: 'block-ui',
      title: 'BlockUI Overlay',
      description: 'Full-screen overlay that prevents user interaction while loading.',
      language: 'html',
    },
  ],
  usage: {
    summary:
      'Use ProgressWidget whenever an async operation requires user feedback. ' +
      'For page-level loads prefer the BlockUI variant; for inline loading states prefer the default spinner.',
    dos: [
      'Bind isLoading to an observable/signal so the spinner disappears automatically.',
      'Provide a statusMessage so users know what is loading.',
      'Use blockUi only when users must not interact with the page during the operation.',
    ],
    donts: [
      'Do not hardcode isLoading="true" — always control it from component state.',
      'Do not stack multiple BlockUI spinners on the same page.',
      'Do not use spinner sizes below 1rem — they are illegible.',
    ],
  },
  activity: {
    summary:
      'Adopted across async-heavy views. Track usage and reported issues here as ' +
      'the component matures toward a stable release.',
  },
  // Properties (inputs/outputs) come from the Compodoc-generated map,
  // COMPONENT_PROPERTIES, keyed by compodocSymbol. See `pnpm docs:properties`.
  theming: [
    {
      variable: '--echo-progress-spinner-color',
      default: 'var(--echo-primary-color)',
      description: 'Stroke color of the spinner arc.',
    },
    {
      variable: '--echo-progress-widget-message-color',
      default: 'var(--echo-text-color)',
      description: 'Color of the status message text.',
    },
    {
      variable: '--echo-progress-widget-overlay-bg',
      default: 'rgba(0, 0, 0, 0.4)',
      description: 'Background of the BlockUI full-screen overlay.',
    },
  ],
};
