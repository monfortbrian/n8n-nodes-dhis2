# n8n-nodes-dhis2

[![npm](https://img.shields.io/npm/v/n8n-nodes-dhis2)](https://www.npmjs.com/package/n8n-nodes-dhis2)
[![npm downloads](https://img.shields.io/npm/dt/n8n-nodes-dhis2)](https://www.npmjs.com/package/n8n-nodes-dhis2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

n8n community node for [DHIS2](https://dhis2.org). Query analytics, push aggregate data, manage tracker events, enrollments, and FHIR interoperability.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

---

## Installation

**Via n8n UI:** Settings → Community Nodes → search `n8n-nodes-dhis2` → Install

**Via npm:**
```bash
npm install n8n-nodes-dhis2
```

---

## Credentials

| Field    | Description |
|----------|-------------|
| Base URL | Your DHIS2 instance (e.g. `https://play.im.dhis2.org/stable-2-43-0`) |
| Username | DHIS2 username |
| Password | DHIS2 password |

Demo: `https://play.im.dhis2.org/stable-2-43-0` username `admin`, password `district`

---

## Resources & Operations

| Resource           | Operations |
|--------------------|------------|
| Analytics          | Query |
| Data Value Set     | Get, Push |
| Enrollment         | Create, Get |
| Event              | Create, Get, Get Many |
| FHIR               | Read Patient, Search Patients, Create Observation, Search Observations |
| Organisation Unit  | Get, Get Many |
| Program            | Get, Get Many |
| Tracked Entity     | Get, Get Many |

---

## Example: Query Analytics

```
Resource:   Analytics
Operation:  Query
Dimension:  dx:Uvn6LCg7dVU;ou:ImspTQPwCqd;pe:LAST_12_MONTHS
```

Returns each row as a flat object: `{ dx, ou, pe, value }`. All three dimensions are required by the DHIS2 Analytics API.

> **Note:** Analytics tables must be built before querying. Run Data Administration → Analytics Tables → Start export on your instance if you get a 409 error.

---

## Compatibility

- **DHIS2:** 2.39+ (Tracker API v2), 2.38+ for FHIR
- **n8n:** 1.0+
- **Node.js:** 22+

---

## API Reference

```
GET  /api/analytics.json?dimension=dx:X&dimension=ou:Y&dimension=pe:Z
GET  /api/dataValueSets.json?dataSet={id}&orgUnit={id}&period={p}
POST /api/dataValueSets.json
POST /api/tracker                        (event + enrollment create)
GET  /api/tracker/enrollments/{id}
GET  /api/tracker/events/{id}
GET  /api/tracker/events?program={id}&orgUnit={id}
GET  /api/tracker/trackedEntities/{id}
GET  /api/tracker/trackedEntities?trackedEntityType={id}&orgUnit={id}
GET  /api/organisationUnits/{id}.json
GET  /api/organisationUnits.json
GET  /api/programs/{id}.json
GET  /api/programs.json
GET  /fhir/Patient/{id}
GET  /fhir/Patient?{param}={value}
POST /fhir/Observation
GET  /fhir/Observation?patient={ref}
```

---

## Resources

- [DHIS2 Documentation](https://docs.dhis2.org/)
- [DHIS2 Web API Guide](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [n8n-nodes-openmrs](https://www.npmjs.com/package/n8n-nodes-openmrs) OpenMRS FHIR integration
- [n8n-nodes-rapidpro](https://www.npmjs.com/package/n8n-nodes-rapidpro) RapidPro messaging

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat(dhis2): your change'`
4. Push and open a Pull Request

---

## Support

- **Issues:** [GitHub Issues](https://github.com/monfortbrian/n8n-nodes-dhis2/issues)
- **n8n Community:** [community.n8n.io](https://community.n8n.io/)

---

## License

[MIT](LICENSE) © 2026 [Monfort Brian N. | 宁俊](https://github.com/monfortbrian)

---

## Acknowledgments

Built to bridge clinical systems and national health information infrastructure. Part of an open-source interoperability stack for outbreak response and healthcare orchestration across low-resource settings.