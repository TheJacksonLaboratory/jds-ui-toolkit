## 0.0.2 (2025-12-15)

### 🧱 Updated Dependencies

- Updated api-clients to 0.1.0-0

## 0.0.1 (2025-10-16)

### 🧱 Updated Dependencies

- Updated api-clients to 0.0.1

# Changelog

All notable changes to the @jax-data-science/components library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.0.1-a.2] - 2025-09-23

### Fixed
- **Styling Issues**: Resolved component styling problems when library was installed in consuming applications
- **Missing TailwindCSS**: Now properly includes compiled TailwindCSS files in the packaged library
- **Root Styles**: Added root `styles.css` to the final package distribution

### Changed
- **Build Process**: Updated packaging pipeline to bundle all necessary style files
- **Output Structure**: Reorganized styling directories to include previously missing CSS files

### Technical Details
- Fixed build scripts to include compiled Tailwind styles that were previously excluded
- Component styles now render correctly when the library is consumed by other applications

---

## [0.0.1-a.1] - 2025-08-14

### Added
- Initial prerelease version of the components library
- Core component architecture and foundation
- Basic build and packaging setup

### Notes
- **⚠️ Prerelease Version**: This is a prerelease version intended for internal testing and development purposes only
- **Not Production Ready**: Do not use in production environments
- **Breaking Changes Expected**: API and functionality may change significantly before stable release

---

## Prerelease Versioning

All versions `0.0.1-alpha.*` are considered **alpha prereleases** and are subject to breaking changes, incomplete features, and potential instability.

For questions or issues, please contact the development team.