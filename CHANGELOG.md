# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.1.0] - 2026-06-02

### Fixed
- Analytics `dimension` query parameter was being serialized as a single mangled string instead of repeated params. DHIS2 Analytics API requires `?dimension=dx:X&dimension=ou:Y&dimension=pe:Z`. Fixed by passing dimension values as an array to the HTTP client.

### Added
- **Enrollment resource** — Create and Get operations via `/api/tracker/enrollments`. Enrollment Create wraps the payload in the Tracker API envelope (`{ enrollments: [...] }`).
- **FHIR resource** — Read Patient, Search Patients, Create Observation, Search Observations via `/fhir/*`. Requires DHIS2 2.38+ with the FHIR module enabled. Uses the same credential as the REST API.

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