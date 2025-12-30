# Changelog

All notable changes to the @jax-data-science/components library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.0.2-0] - 2025-12-30

### Notes
This is the baseline release establishing the changelog format. All previous versions (0.0.1-a.x through 0.0.1-0) were developmental releases.

### Current Features
- Angular component library for data science applications
- PrimeNG UI integration with custom theming
- Auth0 authentication support
- Properly packaged TailwindCSS styling
- Requires `@jax-data-science/api-clients ^0.0.2` as peerDependency

### Technical Details
- Build process includes compiled CSS and styling assets
- Component styles render correctly in consuming applications
- PeerDependency on api-clients updated only when features require it