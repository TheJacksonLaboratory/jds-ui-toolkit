<h1>
  <img src="assets/JAX-logo-helix-only-blue.png" width="45" alt="The Jackson Laboratory Logo" style="vertical-align: middle;"> 
  JAX Data Science UI Toolkit
</h1>

## Table of Contents
- [Overview](#overview)
- [Community](#community)
- [Installation](#installation)
- [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Common Tasks](#common-tasks)
- [Contributing](#contributing)
    - [Development Guidelines](#development-guidelines)
    - [Creating New Components](#creating-new-components)
- [Releasing](#releasing)
    - [Versioning Strategy](#versioning-strategy)
    - [Release Process](#release-process)
- [License](#license)

## Overview

The **JAX Data Science UI Toolkit** repository facilitates the development, 
testing, and deployment of reusable solutions for UI components, visualizations, back-end communication clients, 
and visual design themes. This workspace promotes consistency, reduces redundant efforts, 
and maintains current technology standards across the JAX Data Science community and the wider biomedical 
research community, enabling faster, more reliable scientific insights.

This [monorepo](https://angular.dev/reference/configs/file-structure#multiple-projects) uses 
the Nx build system and contains three libraries:

- **`@jax-data-science/components`** - reusable UI components and visualizations


- **`@jax-data-science/themes`** - standardized visual design system


- **`@jax-data-science/api-clients`** - backend service communication layer

A `demo` application showcases library capabilities and usage examples.

## Community

These open-source libraries are maintained by the **JAX Data Science - Software and Platforms** 
group and designed for the biomedical research community. We welcome researchers and 
developers to adopt these components in their own projects. The workspace evolves 
continuously based on emerging technologies and feedback from users.

## Installation

| Library | Description                                       | NPM Package |
|:--------|:--------------------------------------------------|:------------|
| **@jax-data-science/api-clients** | Back-end service communication layer              | [![npm version](https://img.shields.io/npm/v/@jax-data-science/api-clients?style=for-the-badge&logo=npm&logoColor=white&label=NPM%20Package&color=CB3837)](https://www.npmjs.com/package/@jax-data-science/api-clients) |
| **@jax-data-science/components** | Reusable Angular UI components and visualizations | [![npm version](https://img.shields.io/npm/v/@jax-data-science/components?style=for-the-badge&logo=npm&logoColor=white&label=NPM%20Package&color=CB3837)](https://www.npmjs.com/package/@jax-data-science/components) |
| **@jax-data-science/themes** | Standardized visual design system                 | [![npm version](https://img.shields.io/npm/v/@jax-data-science/themes?style=for-the-badge&logo=npm&logoColor=white&label=NPM%20Package&color=CB3837)](https://www.npmjs.com/package/@jax-data-science/themes) |

*Click badges to view and install packages*


# Development

### Prerequisites

Before you begin, ensure you have the following installed:

🟢 **[Node.js](https://nodejs.org/en/download/)** (v18 or higher) - JavaScript runtime environment
```bash
node --version
```

📦 **[pnpm](https://pnpm.io/installation)** (v8 or higher) - fast, disk space efficient package manager 
```bash
pnpm --version
```

### Setup

1. **Clone the repository**
```bash
   git clone https://github.com/TheJacksonLaboratory/jds-ui-components
   
   cd jds-ui-components
```

2. **Install dependencies**
```bash
   pnpm install
```

### Common Tasks

#### 🚀 Run Demo Application
Start the development server to view the demo app at `http://localhost:4200/`:
```bash
pnpm run start
```

#### 🧪 Run Tests
Execute the test suite for all libraries:
```bash
pnpm run test
```

#### 🔍 Lint Code
Check code quality and style:
```bash
pnpm run lint
```

#### 📦 Build Libraries
Build all libraries for production:
```bash
pnpm run build
```


## Contributing

We welcome contributions from the community! Follow these steps to add your UI components, 
visualizations, themes or API clients to the libraries.

### Development Guidelines

#### Generate a New UI Component
```bash
nx g @nx/angular:component --path=libs/components/src/lib/my-component/my-component --export=true
```

#### Generate a New API Client Service
```bash
nx g @schematics/angular:service --name=my-service --project=api-clients --flat=false --path=libs/api-clients/src/lib/services
```

### Creating New Components

### Step 1. Develop Your Module

Create your contribution in the appropriate library directory (`components`, `themes`, or `api-clients`). 
Follow the established patterns and coding standards used throughout the workspace.


### Step 2. Create a Demo

Build a demonstration in the `demo` application showing how to import and use your module. Include the 
following documentation.

- **Summary** - brief description of what your module does and its primary use case


- **Authentication Requirements** (if applicable) - required authentication type (e.g., API key, OAuth)


- **Contact** - your name/team and preferred contact method


- **Vignette** - step-by-step walkthrough of key features and usage

A clear demo helps other developers understand and adopt your contribution.


### Step 3. Submit Your Pull Request

1. Create a pull request with your module and demo


2. Leave all version numbers unchanged (versioning is handled during the release process)


3. Respond to any feedback from the review process


4. Once approved the admin team will update versions and merge your changes

---

**Questions?** Contact **JAX Data Science - Software and Platforms** ([npm@jax.org](mailto:npm@jax.org)).


## Releasing
The **JAX Data Science - Software and Platforms** team manages the release process, including 
versioning and changelog updates. Contributors should submit pull requests with code changes only.

### Versioning Strategy
Each library follows [semantic versioning](https://semver.org/) (semver) with 
independent version numbers. Version bumps are determined manually based on the scope and impact 
of changes in each library. Releases are scheduled regularly, with urgent releases issued when needed.

### Release Process
Once your pull request is approved and merged, releases follow these steps:

#### 1. Generate Version Updates and Changelogs
```bash
npx nx release version --projects=themes
```

#### 2. Manually Edit CHANGELOG.md Files
Review and refine the generated changelogs for each library being released.
- `libs/components/CHANGELOG.md`
- `libs/themes/CHANGELOG.md`
- `libs/api-clients/CHANGELOG.md`

#### 3. Commit Changes and Create Git Tags
Because each library has its own version and release cycle, we create separate tags and GitHub Releases per library.
```bash 
# stage all version and changelog changes
git add .

# commit the changes
git commit -m "chore: release themes@vX.Y.Z"

# create a git tag for the library
git tag themes@vX.Y.Z

# push the commit to main branch
git push origin --set-upstream origin <your-branch-name>

# push the tag to remote
git push origin tag themes@vX.Y.Z
```
**Note**: Replace `themes@vX.Y.Z` with the actual library name and version (e.g., `themes@v1.2.3`). 
Repeat steps 3-4 for each library being released. 


#### 4. Create GitHub Release (using the edited CHANGELOGS)
```bash
gh release create themes@vX.Y.Z --title "themes@vX.Y.Z" --notes-file ./libs/themes/CHANGELOG.md
```
This creates a release on GitHub with:
- the library-specific tag
- release notes from edited changelog
- downloadable source code archives

#### 5. Publish to NPM
Packages are published to NPM manually through GitHub Actions:
- Navigate to the **Actions** tab in the GitHub repository
- Select the **PUBLISH** workflow
- Click **Run workflow** and choose the **main** branch

## License

This project is licensed under the [MIT License](https://github.com/TheJacksonLaboratory/jds-ui-components/blob/main/LICENSE).

---
Maintained by **JAX Data Science - Software and Platforms** ([npm@jax.org](mailto:npm@jax.org))