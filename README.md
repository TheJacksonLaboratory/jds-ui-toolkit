# JdsUiComponents

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Overview

The JdsUiComponents workspace is a development environment engineered to streamline 
the creation, testing and deployment of shared UI components and libraries across 
the JAX Data Science community. Built on Angular's architecture, this workspace 
leverages modern build tools and development practices to optimize the component 
development lifecycle.

The platform implements a monorepo structure using the Nx build system. 
By centralizing component development, the workspace facilitates code reuse, 
reduces duplication, and ensures architectural consistency across all JAX 
Data Science applications.

Maintained by the JAX Data Science UX/UI team, the workspace undergoes continuous 
updates to leverage the latest stable versions of core technologies, including Angular, 
TypeScript, RxJS, and associated testing frameworks. This commitment to technological 
currency ensures that shared components benefit from the latest performance 
improvements, security patches, and feature enhancements while maintaining 
backward compatibility.


## Setup

Clone the repository, move to a branch and install the dependencies:

```bash
  npm install
```

You must run this before running any other commands.
```bash
  npm run build
```

To start the showcase application, use:

```bash
  npm run start
```

To test before pushing changes, use:

```bash
  npm run test
```

To lint before pushing changes, use:

```bash
  npm run lint
```

To build the showcase application, use:

```bash
  npm run build
```


## Libraries

The workspace already contains two libraries - **@jds/ui-components** 
and **@jds/api-clients** - and one (root) showcase application to test the libraries. 
You should not add new projects to the monorepo workspace. New UI components should 
be added to the **@jds/ui-components** or **jds/api-clients** as shown below:

```angular2html
npx nx g @nrwl/angular:component --path=ui-components/ my-new-component --directory=ui-components
```

The showcase application is to 
test 
You should be adding new projects to 
the workspace.





While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/angular:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/angular:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)




[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/WMyxahRqU7)


## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve jds-ui-components
```

To create a production bundle:

```sh
npx nx build jds-ui-components
```

To see all available targets to run for a project, run:

```sh
npx nx show project jds-ui-components
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
