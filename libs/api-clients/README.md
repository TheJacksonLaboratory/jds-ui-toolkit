# @jax-data-science/api-clients by The Jackson Laboratory (JAX)

## Overview
The library provides a centralized approach for frontend applications to interact with backend services across 
the [JAX Data Science](https://www.jax.org/research-and-faculty/data-science/tools-and-databases) ecosystem. 
It eliminates code duplication by offering reusable API clients with consistent error handling and authentication. 
The library abstracts service communication details, allowing developers to focus on UI logic. All services are 
configurable, handle errors uniformly, and define type-safe models for robust data handling. 

Designed primarily for component consumption but usable independently, it ensures consistency and 
maintainability as backend services evolve.

## Installation

```bash
npm install @jax-data-science/api-clients
```

## Available API Clients

> **Note**: For a complete list of API clients, visit our [Demo Application](https://jds-apps.jax.org/echo) or check the generated documentation.

## Quick Start

### 1. Set needed service configuration in your application (e.g., base URL, timeout)

```typescript
/**
 * app.module.ts
 */

...
// MY_SERVICE_CONFIG: injection token used to provide configuration values (like API urls) for MyService
// MyServiceConfig is an interface that defines the structure of the configuration object
import { MY_SERVICE_CONFIG, MyServiceConfig } from '@jax-data-science/api-clients';
...

...
@NgModule({
  declarations: [...],
  ...
  providers: [
    {
      provide(MY_SERVICE_CONFIG, {
        useValue: {
          baseUrl: 'https://api.example.com', // could also come from environment variables
          timeout: 5000, // could also come from environment variables
        } as MyServiceConfig
      })
    }
  ]
})
```


### 2. Inject and use the API client in your components or services

```typescript


/**
 * example.component.ts
 */

import { Component, OnInit } from '@angular/core';

import { MyService } from '@jax-data-science/api-clients';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})

export class ExampleComponent implements OnInit {
  data: any;

  // Inject MyService into the component
  constructor(private myService: MyService) {}

  ngOnInit() {
    // Use the service to fetch data
    this.myService.getData().subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
```

## Contributing
The JAX Data Science team welcomes and encourages collaborations!

### Ways to Contribute

- API Clients Development

- Testing & Quality Assurance

- Documentation

- Bug Fixes & Enhancements

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