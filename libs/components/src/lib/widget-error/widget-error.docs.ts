import { ComponentDoc } from '../docs/docs.model';

export const widgetErrorDoc: ComponentDoc = {
  name: 'Widget Error',
  slug: 'error-widget',
  category: 'Messaging',
  status: 'in-progress',
  tags: ['error', 'alert', 'feedback'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'WidgetErrorComponent',
  description:
    'A styled inline alert banner used to surface an error message to the user, ' +
    'typically shown in place of content that failed to load.',
  variations: [
    {
      id: 'default',
      title: 'Default',
      description: 'A short, single-line error message.',
      language: 'html',
    },
    {
      id: 'long-message',
      title: 'Long Message',
      description: 'A longer error message that wraps across multiple lines.',
      language: 'html',
    },
  ],
  usage: {
    summary:
      'Use WidgetError to replace a widget/section body when its data failed to load, ' +
      'so users understand why content is missing.',
    dos: [
      'Give errorMessage enough context for a user to understand what failed.',
      'Pair it with a retry action where one is available.',
    ],
    donts: [
      'Do not use it for validation errors on form fields — use inline field errors instead.',
      'Do not leave errorMessage empty; an empty banner communicates nothing.',
    ],
  },
  activity: {
    summary: 'Used as the empty/error state inside AsyncTask when task data fails to load.',
  },
  theming: [],
};
