# Jax Data Science Components

<a alt="The Jackson Laboratory Logo" href="https://www.jax.org" target="_blank" rel="noreferrer">
    <img src="assets/JAX-logo-helix-only-blue.png" width="45">
</a> 

## *Overview*

The *JAX Data Science UI Components* repository is a development workspace designed to streamline the creation, testing and 
deployment of shareable UI components across the JAX Data Science community. This workspace employs development 
practices and tools that promote code reuse, reduce duplication, and ensure architectural consistency throughout the organization.

The workspace uses the Nx build system and has a [monorepo structure](https://angular.dev/reference/configs/file-structure#multiple-projects). 
There are three libraries - *@jax-data-science/components* and *@jax-data-science/api-clients*, one theme - *@jax-data-science/themes*, and one demo application.

The workspace is maintained by the JAX Data Science UI/UX team and undergoes continuous updates to keep up with the 
latest technologies. This commitment to technological currency ensures that all shared UI components benefit from the latest performance 
improvements, security patches, and feature enhancements while also keeping backward compatibility.

## Usage

API Clients
```bash
npm install @jax-data-science/api-clients
```
Components
```bash
npm install @jax-data-science/components @jax-data-science/themes
```

## Development
### Setup
- Clone the workspace from the [GitHub](https://github.com/TheJacksonLaboratory/jds-ui-components) repository

- Install the required [Node.js](https://nodejs.org/en/download/) and [pnpm](https://pnpm.io/installation)
  
### Get Started
```bash
  pnpm install
```
You can use the below Nx command to: 

### Create New Component
```bash
nx g @nx/angular:component --path=libs/components/src/lib/my-new-component/my-new-component --export=true 
```

### Create New API Client
```bash
nx g @schematics/angular:service --name test-service --project api-clients --flat=false --path=libs/api-clients/src/lib/services
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin.

### View Demo App
```bash
  pnpm run start
```

### Testing
```bash
pnpm run test
```
### Linting
```bash
pnpm run lint
```

### Building
```bash
pnpm run build
```

### Pull Requests

Include your service or component in the demo application under `apps/demo`. 

Once PR is approved, you will need to deploy the branch to the GCP instance
where the QA team will be able to test the component using the showcase application

<a alt="The Jackson Laboratory Logo" href="https://www.jax.org" target="_blank" rel="noreferrer">
    <img src="assets/release-process-jax-data-science-ui-components.png" width="100%">
</a> 

### *Releasing*
Once the component has been tested and approved by the QA team, you can proceed with merging the PR and notifying the UI time that a release is necessary.

TODO: Configure the release pipeline to accept a version/tag and update the pipeline to pnpm publish
