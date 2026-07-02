import { ComponentDoc } from '../docs/docs.model';

export const progressWidgetDoc: ComponentDoc = {
  name: 'Progress Widget',
  slug: 'progress-widget',
  description: 'A reusable spinner with an optional status message and UI-block overlay.',
  status: 'in-progress',
  tags: ['loading', 'spinner', 'feedback'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  group: 'components',
  overview: {
    summary:
      'A reusable Angular component that displays a loading spinner and an optional ' +
      'dynamic status message. Supports customizable spinner sizes (rem), optional ' +
      'icon decoration, and a full-screen BlockUI overlay to prevent user interaction ' +
      'during async operations.',
    docsUrl: 'https://jax.org/docs/components/progress-widget',
  },
  variations: [
    {
      id: 'basic-spinner',
      title: 'Basic Spinner',
      description: 'Minimal 1rem spinner with no message.',
      language: 'html',
      code: `<lib-jds-progress-widget [spinnerSize]="1"></lib-jds-progress-widget>`,
    },
    {
      id: 'with-message',
      title: 'Spinner with Message',
      description: '3rem spinner with a static status message.',
      language: 'html',
      code: `<lib-jds-progress-widget\n  [spinnerSize]="3"\n  [statusMessage]="'Loading data...'">\n</lib-jds-progress-widget>`,
    },
    {
      id: 'dynamic-message',
      title: 'Dynamic Message',
      description: 'Default 5rem spinner whose message and loading state are bound to component properties.',
      language: 'html',
      code: `<lib-jds-progress-widget\n  [statusMessage]="message"\n  [isLoading]="isLoading">\n</lib-jds-progress-widget>`,
    },
    {
      id: 'with-icon',
      title: 'With Icon',
      description: 'Spinner paired with a PrimeIcons icon class for contextual feedback.',
      language: 'html',
      code: `<lib-jds-progress-widget\n  [statusMessage]="'Downloading'"\n  [iconClass]="'pi pi-download tw-text-blue-600'">\n</lib-jds-progress-widget>`,
    },
    {
      id: 'block-ui',
      title: 'BlockUI Overlay',
      description: 'Full-screen overlay that prevents user interaction while loading.',
      language: 'html',
      code: `<lib-jds-progress-widget\n  [blockUi]="true"\n  [statusMessage]="'Processing...'"\n></lib-jds-progress-widget>`,
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
  api: {
    inputs: [
      { name: 'isLoading', type: 'boolean', default: 'true', required: false, description: 'Controls spinner visibility.' },
      { name: 'statusMessage', type: 'string', default: "''", required: false, description: 'Text displayed below the spinner.' },
      { name: 'spinnerSize', type: 'number', default: '5', required: false, description: 'Spinner diameter in rem.' },
      { name: 'blockUi', type: 'boolean', default: 'false', required: false, description: 'Enables full-screen BlockUI overlay.' },
      { name: 'iconClass', type: 'string', default: "''", required: false, description: 'PrimeIcons or custom CSS class for an icon beside the message.' },
      { name: 'iconLeft', type: 'boolean', default: 'false', required: false, description: 'Places the icon to the left of the message when true.' },
    ],
    outputs: [],
  },
};
