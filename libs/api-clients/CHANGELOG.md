# Changelog

All notable changes to the @jax-data-science/api-clients library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2-0] - 2025-12-30

### Changed
- **Changelog Reset**: Starting fresh with version 0.0.2-0 for cleaner version history
- Updated snp-grid-client to remove auto-fetching on initialization in favor of explicit API calls

### Added
- ISA Data service for fetching study metadata
- MeasureSeriesMetadata model now includes units for measurement, treatment, and initiated at age

### Notes
- This version consolidates previous prerelease iterations (0.0.1-a.1, 0.0.4-1)
- Core functionality includes HTTP client architecture, service layer, and data models
- For questions or issues, please contact the development team

---

## Historical Versions (Prior to Changelog Reset)

Previous versions (0.0.1-0 through 0.0.4-1) were developmental releases. Key features implemented during this period:
- Basic service architecture
- Core HTTP client functionality
- ISA Data service
- SNP Grid client
- MeasureSeriesMetadata models
