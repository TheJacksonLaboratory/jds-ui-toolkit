# Jax Data Science Components
# <img src="assets/JAX-logo-helix-only-blue.png" width="45" alt="The Jackson Laboratory Logo">
## Overview

The **JAX Data Science UI Components** repository is a development workspace designed to streamline the creation, testing and 
deployment of shareable UI components across the JAX Data Science community. This workspace employs development 
practices and tools that promote code reuse, reduce duplication, and ensure architectural consistency throughout the organization.

The workspace has a [monorepo structure](https://angular.dev/reference/configs/file-structure#multiple-projects) and uses the Nx build system. 
There are three libraries: 
- `@jax-data-science/components` 
- `*@jax-data-science/api-clients*`
- `*@jax-data-science/themes*` 

and one `demo` application for showcasing the components.

The workspace is maintained by the JAX Data Science UI/UX team and undergoes continuous updates to keep up with the 
latest technologies. This commitment to technological currency ensures that all shared UI components benefit from the latest performance 
improvements, security patches, and feature enhancements while also keeping backward compatibility.

## Installation

#### @jax-data-science/api-clients
```bash
npm install @jax-data-science/api-clients
```
#### @jax-data-science/components
```bash
npm install @jax-data-science/components @jax-data-science/themes
```

## Development

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) and [pnpm](https://pnpm.io/installation)

### Setup
- Clone the workspace from the [GitHub repository](https://github.com/TheJacksonLaboratory/jds-ui-components)

- Install dependencies:

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

## Contribution Workflow

### Pull Requests

- Include your service or component in the demo application under `apps/demo`. 

- Once PR is approved, deploy the branch to the GCP instance
where the QA team can test the component using the showcase application

<a alt="The Jackson Laboratory Logo" href="https://www.jax.org" target="_blank" rel="noreferrer">
    <img src="assets/release-process-jax-data-science-ui-components.png" width="100%">
</a> 

### Releasing
Once the component has been tested and approved by the QA team:

1. **Merge PR**: Proceed with merging the PR and notifying the UX/UI team that a release is necessary. 
Check if any other changes are ready to be released by other developers.
2. **Version Planning**: Determine the next best version for libraries affected using [Semver](https://semver.org/)
3. **Update Local**: Pull the new updates from `main` branch. 
4. **Version Update**: Update versions for your libraries, either define `--projects` or remove flag for all. 
Try a dry-run first:
   - `nx release --projects=api-clients,components,themes --skip-publish --dry-run`
   - You may get a "first release" just add `--first-release`
5. **Push Changes**
   -  `git push origin main --tags`
6. **Deploy**: Run the `RELEASE` GitHub action to deploy (to NPM) - _**DO NOT DEPLOY!!** - 
NPM deployments are done only by the QA team_

---
*Maintained by the JAX Data Science UI/UX Team*