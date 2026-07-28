import { ServiceDoc } from '../../docs/service-docs.model';

export const asyncTaskServiceDoc: ServiceDoc = {
  name: 'Async Task Service',
  slug: 'asynctask',
  category: 'Async Processing',
  status: 'in-progress',
  tags: ['tasks', 'runs', 'sse'],
  isAuthRequired: true,
  contact: 'npm@jax.org',
  compodocSymbol: 'AsyncTaskService',
  description:
    'Backend client for submitting async task inputs, creating and tracking runs, ' +
    'fetching results, and streaming run status updates over server-sent events.',
  usageExamples: [
    {
      id: 'basic',
      title: 'Fetching Runs',
      description:
        'Inject the service and list existing runs. Unlike other services, the base URL ' +
        'defaults to `/asynctask/api` and can be overridden at runtime with setApiBaseUrl().',
      code: `import { inject } from '@angular/core';
import { AsyncTaskService } from '@jax-data-science/api-clients';

export class MyComponent {
  private asyncTaskService = inject(AsyncTaskService);

  loadRuns() {
    return this.asyncTaskService.getRuns();
  }
}`,
      language: 'typescript',
    },
  ],
  usage: {
    summary: 'Use AsyncTaskService to submit inputs, launch runs, and track their status and results.',
    dos: [
      'Call setApiBaseUrl() before making requests if the default /asynctask/api base URL is wrong for your environment.',
      'Pass a valid Auth0 access token to getRunEvents() to authenticate the event stream.',
    ],
    donts: [
      'Do not poll getRun() in a loop for status updates — use getRunEvents() for real-time updates instead.',
    ],
  },
  activity: {
    summary: 'Used in production via AsyncTaskFacade, which backs the AsyncTask component.',
  },
};
