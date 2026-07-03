import { ComponentDoc } from '../docs/docs.model';

export const authenticationDoc: ComponentDoc = {
  name: 'Authentication',
  slug: 'auth',
  category: 'Utilities',
  status: 'in-progress',
  tags: ['auth', 'login', 'auth0'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'AuthenticationComponent',
  description:
    'Renders login/logout controls backed by Auth0, reflecting the current session ' +
    'state and redirecting through the configured Auth0 tenant.',
  variations: [
    {
      id: 'basic',
      title: 'Basic',
      description: 'Default login/logout controls with no custom redirect configuration.',
      language: 'html',
    },
    {
      id: 'custom-redirect',
      title: 'Custom Redirect',
      description: 'Login redirects to a specific post-login target; logout returns to the current origin.',
      language: 'html',
    },
  ],
  usage: {
    summary: 'Use Authentication wherever a page needs a login/logout control backed by the app’s Auth0 tenant.',
    dos: [
      'Set configLogin.appState.target when you need the user to land on a specific page after login.',
      'Let configLogout default returnTo to the current origin unless you need a different landing page.',
    ],
    donts: [
      'Do not build custom login/logout buttons that call AuthService directly — reuse this component.',
    ],
  },
  activity: {
    summary: 'Embedded inside Navbar to provide the app-wide login/logout control.',
  },
  theming: [],
};
