# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- Add TSB fallback (manual link/upload).

## [0.1.0] - 2026-03-01
### Added
- VIN report view with PDF/CSV export.
- Saved reports UI + search history.
- Subscription tiers + shop accounts scaffolding.
- Data layer wrapper with caching, rate limiting, and clearer error states.
- Configurable API endpoints + user-facing data disclaimer.
- Labor estimate provider adapter interface + shortlist research notes.
- Accessibility labels, empty-state messaging, and loading spinners.
- Responsive layout updates + consolidated styles/scripts.
- ESLint/Prettier config + CI workflow + npm scripts for lint/test/build.
- Basic tests for CSV export and parsing.
- Draft privacy policy + terms of service.

### Changed
- Split `script.js` into modules and consolidated duplicated logic.
- Removed or documented unused modules/features.
- Moved inline styles into CSS classes.
