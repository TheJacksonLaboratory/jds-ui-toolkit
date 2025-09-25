# @jax-data-science/components

A comprehensive UI component library built with Angular and designed for JAX Data Science applications. This library was generated with [Nx](https://nx.dev) and provides reusable, accessible, and consistent UI components.

## Installation

```bash
npm install @jax-data-science/components @jax-data-science/themes
```

## Quick Start

### 1. Import Module

Import the required modules in your Angular application:

```typescript

import { SomeJAXComponent } from '@jax-data-science/components';

@Component({
  imports: [..., SomeJAXComponent, ...],
})
export class AppComponent {}
```

### 2. Import Styles

Add the required styles to your `angular.json` file:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@jax-data-science/components/styles/styles.css",
              "node_modules/@jax-data-science/components/styles/components-tailwind.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

### 3. Use Components

Start using components in your templates:

```html
<jax-button variant="primary" size="medium">
  Click me
</jax-button>

<jax-card>
  <jax-card-header>
    <h2>Card Title</h2>
  </jax-card-header>
  <jax-card-content>
    Card content goes here
  </jax-card-content>
</jax-card>
```

## Styling System

### Available Stylesheets

The `@jax-data-science/components` library provides two main stylesheets:

| Stylesheet | Description | Required |
|-----------|-------------|----------|
| `styles/styles.css` | Core component styles, themes, and design tokens | ✅ Yes |
| `styles/components-tailwind.css` | Compiled Tailwind CSS utilities for enhanced styling | ⚠️ Optional |

### Style Import Options

#### Option 1: Angular.json (Recommended)
Add styles to your `angular.json` configuration:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@jax-data-science/components/styles/styles.css",
              "node_modules/@jax-data-science/components/styles/components-tailwind.css"
            ]
          }
        }
      }
    }
  }
}
```

#### Option 2: Global Styles
Import in your `src/styles.css` file:

```css
@import '~@jax-data-science/components/styles/styles.css';
@import '~@jax-data-science/components/styles/components-tailwind.css';
```

#### Option 3: Component-level Import
Import in specific components:

```scss
// In your component.scss file
@import '~@jax-data-science/components/styles/styles.css';
```

### Theming

The library supports custom theming through CSS custom properties. See the `@jax-data-science/themes` package for available themes and customization options.

## Available Components

> **Note**: For a complete list of components and their APIs, visit our [Demo Application](https://jds-apps.jax.org/components) or check the generated documentation.


## Contributing

This library is part of the JAX Data Science UI Components monorepo. For contribution guidelines, please refer to the main repository documentation.

### Reporting Issues
- Create issues in the main repository
- Provide detailed reproduction steps
- Include browser and version information

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for recent updates and version history.


---

**Maintained by**: JAX Data Science UI/UX Team  
**Repository**: [jds-ui-components](https://github.com/TheJacksonLaboratory/jds-ui-components)  
**Demo Application**: [View Components](https://jds-apps.jax.org/components)