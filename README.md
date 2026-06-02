# n8n-nodes-dhis2

![n8n-nodes-dhis2](https://img.shields.io/npm/v/n8n-nodes-dhis2)
![npm](https://img.shields.io/npm/dt/n8n-nodes-dhis2)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

n8n node for DHIS2. Supports aggregate data, analytics, tracker, enrollment, and FHIR interoperability.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

---

## Installation

**Via n8n UI:** Search DHIS2 as verified node or simply go to Settings → Community Nodes → `n8n-nodes-dhis2`

**Via npm:**
```bash
npm install n8n-nodes-dhis2
```

---

## Credentials

| Field    | Description                                     |
|----------|-------------------------------------------------|
| Base URL | Your DHIS2 instance (e.g. `https://play.dhis2.org/40.4.0`) |
| Username | DHIS2 username                                  |
| Password | DHIS2 password                                  |

Test credentials: `admin` / `district` on the demo server above.

---

## Resources & Operations

| Resource           | Operations                                              |
|--------------------|---------------------------------------------------------|
| Analytics          | Query                                                   |
| Data Value Set     | Get, Push                                               |
| Enrollment         | Create, Get                                             |
| Event              | Get, Get Many                                           |
| FHIR               | Read Patient, Search Patients, Create Observation, Search Observations |
| Organisation Unit  | Get, Get Many                                           |
| Program            | Get, Get Many                                           |
| Tracked Entity     | Get, Get Many                                           |

---

## Example: Query Analytics

```
Resource:   Analytics
Operation:  Query
Dimension:  dx:Uvn6LCg7dVU;ou:ImspTQPwCqd;pe:LAST_12_MONTHS
```

Returns each analytics row as a flat object keyed by header name (e.g. `dx`, `ou`, `pe`, `value`).

The `dimension` field accepts semicolon-separated `dx`, `ou`, and `pe` values all three are required by the DHIS2 Analytics API.

---

## FHIR

FHIR operations hit `/fhir/*` on the same DHIS2 instance using the same credentials. Requires DHIS2 2.38+ with the FHIR module enabled.

Verify your instance supports it:
```
GET https://your-instance/fhir/metadata
```

A `CapabilityStatement` response means FHIR is active.

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
POST /api/tracker                          (enrollment create)
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

## Use Cases

### Health Information Reporting

- Automate monthly facility reporting to DHIS2
- Aggregate clinical data from EMRs (OpenMRS, HAPI FHIR) into DHIS2
- Validate data quality before submission

### Disease Surveillance

- Monitor tracker program events for outbreak detection
- Push real-time case counts from facility systems
- Aggregate lab-confirmed cases by district

### Program Monitoring

- Track HIV/TB program indicators across facilities
- Query analytics for maternal health coverage rates
- Monitor immunization program performance

### Data Integration

- Sync organisation unit hierarchies with other systems
- Bridge OpenMRS clinical data to DHIS2 aggregate reporting
- Feed DHIS2 analytics into dashboards and BI tools


## Compatibility

- **n8n version:** 1.0+ or higher
- **DHIS2 version:** 2.39+ (Tracker API v2)
- **Node.js:** 22.0.0 or higher


## Resources

- [DHIS2 Documentation](https://docs.dhis2.org/)
- [DHIS2 Web API Guide](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html)
- [DHIS2 Demo Server](https://play.dhis2.org)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [OpenMRS n8n Node](https://www.npmjs.com/package/n8n-nodes-openmrs) clinical data from OpenMRS
- [RapidPro n8n Node](https://www.npmjs.com/package/n8n-nodes-rapidpro) messaging workflows via RapidPro


## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

[MIT License](LICENSE)

Copyright (c) 2026 [Monfort Brian N.](https://github.com/monfortbrian)


## Support

- **Issues:** [GitHub Issues](https://github.com/monfortbrian/n8n-nodes-dhis2/issues)
- **n8n Community:** [n8n Community Forum](https://community.n8n.io/)


## Acknowledgments

Built to bridge the gap between clinical systems and national health information systems. Designed for health workers, program managers, and data officers in low-resource settings.

---

**Made with ❤️ for the global health community**