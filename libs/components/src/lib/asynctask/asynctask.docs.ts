import { ComponentDoc } from '../docs/docs.model';

export const asyncTaskDoc: ComponentDoc = {
  name: 'Async Tasks',
  slug: 'async-tasks',
  category: 'Data Display',
  status: 'in-progress',
  tags: ['table', 'tasks', 'async'],
  isAuthRequired: true,
  contact: 'npm@jax.org',
  compodocSymbol: 'AsyncTaskComponent',
  description:
    'A paginated, filterable table of asynchronous task runs with expandable ' +
    'detail rows and a live status stream via server-sent events.',
  variations: [
    {
      id: 'basic',
      title: 'Basic',
      description:
        'The default table, wired to the app’s real task backend and Auth0 access token. ' +
        'Without a reachable task backend in local dev this renders the component’s own ' +
        'built-in empty/error state — that is real component behavior, not a stub.',
      language: 'html',
    },
  ],
  usage: {
    summary: 'Use AsyncTask to show users the status of long-running background operations they started.',
    dos: [
      'Pass a valid accessToken so the live event stream can authenticate.',
      'Provide a detailsTemplate in tableConfig when tasks need richer expanded-row content.',
    ],
    donts: [
      'Do not poll for task status yourself — the component manages its own SSE subscription.',
    ],
  },
  activity: {
    summary: 'Used on the async task management page; embeds FacetSearch (status filter) and WidgetError (error state).',
  },
  theming: [],
};
