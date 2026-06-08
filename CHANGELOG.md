# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.2.1] - 2026-06-09

### Fixed
- GitHub Actions publish workflow updated: added `--ignore-scripts` to bypass `prepublishOnly` hook, updated action versions to `checkout@v4.2.2` and `setup-node@v4.4.0` for Node.js 24 compatibility, added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env var.
- npm provenance now active, all future releases published via GitHub Actions with cryptographic provenance statement.

---

## [1.2.0] - 2026-06-02

### Fixed
- Analytics `dimension` serialization: n8n serializes arrays as `dimension[0]=x&dimension[1]=y` (indexed), which DHIS2 rejects with a 500. Switched to manual query string construction `dimension=dx:X&dimension=ou:Y&dimension=pe:Z` — bypassing `qs` entirely for analytics requests.

### Added
- **Event: Create** operation via `/api/tracker`. Wraps the payload in `{ events: [...] }`. Supports program, programStage, orgUnit, occurredAt, status, and dataValues.

---

## [1.1.0] - 2026-06-01

### Added
- **Enrollment resource** Create and Get operations via `/api/tracker/enrollments`. Create wraps the payload in `{ enrollments: [...] }`.
- **FHIR resource** Read Patient, Search Patients, Create Observation, Search Observations via `/fhir/*`. Requires DHIS2 2.38+ with the FHIR module enabled.

---

## [1.0.0] - 2026-03-02

### Added
- Initial release
- Analytics: Query
- Data Value Set: Get, Push
- Event: Get, Get Many
- Organisation Unit: Get, Get Many
- Program: Get, Get Many
- Tracked Entity: Get, Get Many
- Basic Auth credential with `/api/me` test
- `usableAsTool` support for AI Agent workflows