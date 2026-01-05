## @jax-data-science/themes by The Jackson Laboratory (JAX)

# Overview
This library's purpose is to provide standardized theming solution for applications and component libraries within
the JAX Data Science ecosystem. As JAX Data Science builds interconnected apps and shared libraries that
get embedded into each other through microforntend patterns like module federation, maintaining visual consistency
becomes critical. The `@jax-data-science/themes` library ensures that components look and behave consistently
whether they're used as standalone applications, embedded as widgets, or composed through microfrontend
architectures.

The library provides centralized design tokens, preset themes, and utiities that work seamlessly
across different frameworks and integration patterns. All themes are built with accessibility as a priority,
meeting WCAG 2.1 AA standards by default. By using a single source of truth for theming, teams can focus on
building features while automatically maintaining brand consistency and reducing styling duplication across the
entire JAX ecosystem.

## Installation

```bash
npm install @jax-data-science/themes
```


## Available Themes
Currently, the library includes the **Echo** theme, our flagship preset built on top of PrimeNG's modern style
**Lara** theme.

**Echo** extends **Lara** with JAX-specific design tokens including custom color palettes,
typography scales, and spacing systems tailored for data-intensive scientific applications. As the library evolves,
additional theme presets will be added to support different use cases and branding requirements across The
Jackson Laboratory's data science ecosystem.

## Quick Start
### 1. Import and Apply the EchoPreset Theme

```typescript
// app.config.ts

import { EchoPreset } from '@jax-data-science/themes';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: EchoPreset
      }
    })
  ]
};

```

### 2. Use in Components
Once configured, all PrimeNG components will automatically use the Echo theme
```typescript 
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonModule],
  template: `
    
  `
})
export class ExampleComponent {}
```

### 3. Access Theme Variables in CSS
The Echo theme exposes CSS custom properties that you can use in your styles:
```css
.custom-component {
  background-color: var(--primary-color);
  color: var(--text-color);
  border-radius: var(--border-radius);
}
```


## Contributing
The JAX Data Science team welcomes and encourages collaborations!

### Why Contribute?
By contributing to `@jax-data-science/themes`, you help:
- establish consistent, accessible design patterns across JAX applications, databases and tools
- build reusable themes that benefit the entire research community
- improve the developer experience for teams working with JAX platforms
- advance open science through better data visualization and user interfaces

### Ways to Contribute
- **Theme Development**
- **Accessibility Improvements**
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

**Demo Application**: [View Echo Theme](https://jds-apps.jax.org/echo)