# Changelog

All notable changes to FlowForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial repository structure
- Project documentation:
  - README.md with project overview
  - ARCHITECTURE.md with system design
  - VISUAL_LANGUAGE.md with node specifications
  - DECISION_LOG.md for tracking choices
  - TECH_DECISIONS.md for technology evaluation
  - CONTRIBUTING.md for contributor guidelines
  - GIT_WORKFLOW.md for GitFlow and Conventional Commits guide
- Directory structure:
  - `src/` - Source code (frontend, backend, build-server, monitor-server)
  - `doc/` - Documentation
  - `samples/` - Example projects
  - `test/` - Test files
  - `release/` - Release builds
- Git workflow standards:
  - GitFlow branching model implemented
  - Conventional Commits specification adopted
  - Commit message template (.gitmessage)
  - Commitlint configuration (.commitlintrc.json)
  - GitHub Actions workflow for commit validation
  - Pull request template
  - Issue templates (bug report, feature request)
  - Development setup scripts (setup-dev.sh, setup-dev.ps1)
  - Automated commitlint and husky installation via setup script
  - Commit validation test scripts (test-commitlint.sh, test-commitlint.ps1)
- Comprehensive .gitignore covering multiple tech stacks
- package.json for Node.js dependencies management

### Changed
- Bump `actions/checkout` from v4 to v6 in CI workflow

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

---

## Version History

### [0.1.0] - 2026-02-12

Initial repository setup and documentation phase.

---

## Version Format

**[Major.Minor.Patch]**
- **Major**: Breaking changes or major feature additions
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, minor improvements

---

*Keep this file updated with each significant change!*
