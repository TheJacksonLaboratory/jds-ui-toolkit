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
    'Maintenance only: bug fixes, no new features. New app chrome should come from a per-app design.',
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
  ],
  usage: {
    summary: 'Use Navbar once per app shell as the top-level navigation bar.',
    dos: [
      'Provide items that mirror your app’s real route structure.',
      'Set authentication to true only when an AuthService provider is configured.',
      'Set mobileLogoPosition to center only when the right side of the bar holds a single control; keep the default left when it holds several.',
    ],
    donts: [
      'Do not render more than one Navbar per page — it is meant to be a single global header.',
      'Do not extend Navbar with new features; build new layout or chrome from a per-app design instead.',
    ],
  },
  activity: {
    summary: 'Used as the app-wide header in apps/demo/src/app/app.component.html.',
  },
  theming: [],
};
