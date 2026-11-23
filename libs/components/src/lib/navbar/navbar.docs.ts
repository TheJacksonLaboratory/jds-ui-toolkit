import { ComponentDoc } from '../docs/docs.model';

export const navbarDoc: ComponentDoc = {
  name: 'Navbar',
  slug: 'navbar',
  category: 'Navigation',
  status: 'in-progress',
  tags: ['navigation', 'menu', 'header'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'NavbarComponent',
  description:
    'The application top navigation bar: brand/logo, a PrimeNG menubar, an optional ' +
    'external link, and optional Auth0-backed login/logout controls. ' +
    'Apps can project their own controls into the right side of the bar with the jdsNavbarEnd attribute.',
  variations: [
    {
      id: 'basic',
      title: 'Basic',
      description: 'Title and menu items, no authentication controls.',
      language: 'html',
    },
    {
      id: 'with-auth',
      title: 'With Authentication',
      description: 'Adds the login/logout control backed by the app’s Auth0 tenant.',
      language: 'html',
    },
    {
      id: 'custom-branding',
      title: 'Custom Branding',
      description: 'Custom title, icon, and external link label/URL.',
      language: 'html',
    },
    {
      id: 'custom-end-content',
      title: 'Custom End Content',
      description: 'Project app-specific controls into the right side with the jdsNavbarEnd attribute.',
      language: 'html',
    },
  ],
  usage: {
    summary: 'Use Navbar once per app shell as the top-level navigation bar.',
    dos: [
      'Provide items that mirror your app’s real route structure.',
      'Set authentication to true only when an AuthService provider is configured.',
      'Set mobileLogoPosition to center only when the right side of the bar holds a single control; keep the default left when it holds several.',
      'Use the jdsNavbarEnd slot for app-specific controls (e.g. a clipboard button) instead of forking Navbar.',
    ],
    donts: [
      'Do not render more than one Navbar per page — it is meant to be a single global header.',
    ],
  },
  activity: {
    summary: 'Used as the app-wide header in apps/demo/src/app/app.component.html.',
  },
  theming: [],
};
