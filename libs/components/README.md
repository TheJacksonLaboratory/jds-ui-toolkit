## @jax-data-science/components by The Jackson Laboratory (JAX)

# Overview
This library provides reusable, accessible, and consistent UI components that work seamlessly across
multiple applications and micro-frontend architectures. Built with modern web standards, the library ensures
components maintain visual and functional consistency whether used in standalone apps, embedded widgets, or
federated modules. The library integrates seamlessly with `@jax-data-science/themes` to provide a cohesive
design system across the entire JAX Data Science community.

## Installation

```bash
npm install @jax-data-science/components @jax-data-science/themes
```

## Available Components

> **Note**: For a complete list of components and their APIs, visit our [Demo Application](https://jds-apps.jax.org/echo) or check the generated documentation.

## Theming
The library supports custom theming through CSS custom properties. See the `@jax-data-science/themes` package
for available themes and customization options.

## Quick Start
### 1. Import Module
Import the required modules in your application:
```typescript
import { SomeJAXComponent } from '@jax-data-science/components';

@Component({
  imports: [..., SomeJAXComponent, ...],
})
export class AppComponent {}
```

### 2. Import Styles
Add the required styles to your `angular.json` file:
```typescript
{
  "projects": {
    "your-project-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              ...
              "node_modules/@jax-data-science/components/styles/styles.css",
              "node_modules/@jax-data-science/components/styles/components-tailwind.css",
              ...
            ]
          }
        }
      }
    }
  }
}
```

### 3. Use Components
Start using components in your templates
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


## Contributing
The JAX Data Science team welcomes and encourages collaborations!

### Why Contribute?
By contributing to `@jax-data-science/components`, you help:
- robust library of reusable components that accelerate development across JAX teams
- establish consistent user experiences across the JAX Data Science discovery ecosystem
- advance open science by sharing high-quality UI patterns with the broader research community
- collaborate with scientists and developers to solve real-world data visualization and interaction challenges
- shape the future of scientific software interfaces and user experience design

### Ways to Contribute

- **Component Development**

- **Testing & Quality Assurance**

- **Documentation**

- **Bug Fixes & Enhancements**

### Reporting Issues

Found a bug or have a suggestion? Please email us at: npm@jax.org

When reporting issues please include:

- a clear description of the problem or suggestion
- steps to reproduce (for bugs)
- expected vs. actual behavior
- screenshots or code examples when applicable
- environment details (browser, framework version, etc.)


## Changelog

For detailed release notes and version history, see [CHANGELOG.md](./CHANGELOG.md).

## More Information

**GitHub Repo**: [jds-ui-components](https://github.com/TheJacksonLaboratory/jds-ui-components)

**Maintained By**: JAX Data Science

**Contact**: npm@jax.org

**Demo Application**: [View JDS Components](https://jds-apps.jax.org/echo)