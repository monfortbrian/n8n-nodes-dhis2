# n8n-nodes-dhis2

![n8n-nodes-dhis2](https://img.shields.io/npm/v/n8n-nodes-dhis2)
![npm](https://img.shields.io/npm/dt/n8n-nodes-dhis2)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This is an n8n community node that provides seamless integration with DHIS2 through its Web API. It enables health information workflows to push and pull aggregate data, manage organisation units, track entities, query analytics, and automate reporting pipelines.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

## Features

**Aggregate Data Management**

- Push data values to DHIS2 data sets
- Retrieve reported data for any data set, organisation unit, and period
- Automate monthly/quarterly reporting workflows

**Organisation Unit Management**

- Fetch organisation unit hierarchies
- List and filter organisation units with pagination

**Analytics**

- Query DHIS2 analytics engine with flexible dimensions
- Retrieve data elements, indicators, and program indicators across periods and org units

**Tracker**

- Access tracked entities (e.g. individual patients, cases)
- Retrieve events from tracker programs
- List and filter by program, org unit, and entity type

**Program Management**

- List available programs (aggregate and tracker)
- Retrieve program details and configuration

**Developer-Friendly**

- Simple Basic Authentication with DHIS2 credentials
- Paginated results with customizable limits
- Built-in error handling
- Works as an AI Agent tool (`usableAsTool`)

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-dhis2`
5. Click **Install**

### Manual Installation
```bash
npm install n8n-nodes-dhis2
```

### Build from Source
```bash
git clone https://github.com/monfortbrian/n8n-nodes-dhis2.git
cd n8n-nodes-dhis2
npm install
npm run build
npm link
```

## Credentials

Before using the DHIS2 node, you need to configure credentials:

1. In n8n, go to **Credentials** → **New**
2. Search for **DHIS2 API**
3. Configure:
   - **Base URL**: Your DHIS2 instance URL (e.g., `https://play.dhis2.org/40.4.0`)
   - **Username**: Your DHIS2 username
   - **Password**: Your DHIS2 password

The credential test verifies connectivity by calling the `/api/me` endpoint.

**Demo Server:** You can test with `https://play.dhis2.org/40.4.0` (username: `admin`, password: `district`).

## Usage

### Supported Resources

| Resource              | Description                        | Use Cases                                     |
| --------------------- | ---------------------------------- | --------------------------------------------- |
| **Data Value Set**    | Aggregate data reporting           | Monthly reports, facility data submission      |
| **Organisation Unit** | Health facility hierarchy           | Org unit lookups, hierarchy navigation         |
| **Analytics**         | Aggregated analytics queries       | Dashboards, indicator trends, population stats |
| **Tracked Entity**    | Individual-level records           | Patient tracking, case management              |
| **Event**             | Program stage events               | Event-based surveillance, visit records        |
| **Program**           | Program configuration              | Program listing, metadata discovery            |

### Operations

| Resource              | Operations        |
| --------------------- | ----------------- |
| **Data Value Set**    | Get, Push         |
| **Organisation Unit** | Get, Get Many     |
| **Analytics**         | Query             |
| **Tracked Entity**    | Get, Get Many     |
| **Event**             | Get, Get Many     |
| **Program**           | Get, Get Many     |

## Examples

### Example 1: Fetch Monthly Report Data
```
1. Add DHIS2 node
2. Select Resource: Data Value Set
3. Select Operation: Get
4. Enter Data Set ID: pBOMPrpg1QX
5. Enter Organisation Unit ID: DiszpKrYNg8
6. Enter Period: 202501
7. Execute
```

**Output:** Returns all data values reported for that data set, org unit, and period.

### Example 2: Push Aggregate Data
```
1. Add DHIS2 node
2. Select Resource: Data Value Set
3. Select Operation: Push
4. Enter JSON payload:
```
```json
{
  "dataSet": "pBOMPrpg1QX",
  "period": "202501",
  "orgUnit": "DiszpKrYNg8",
  "dataValues": [
    { "dataElement": "f7n9E0hX8qk", "value": "12" },
    { "dataElement": "Ix2HsbDMLea", "value": "24" }
  ]
}
```

### Example 3: Query Analytics
```
1. Add DHIS2 node
2. Select Resource: Analytics
3. Select Operation: Query
4. Enter Dimension: dx:Uvn6LCg7dVU;ou:ImspTQPwCqd;pe:LAST_12_MONTHS
5. Execute
```

**Output:** Returns analytics data with headers and rows for the requested dimensions.

### Example 4: OpenMRS → DHIS2 Reporting Pipeline

Combine with the [n8n-nodes-openmrs](https://www.npmjs.com/package/n8n-nodes-openmrs) node:
```
[OpenMRS Encounters] → [Code: Aggregate by Diagnosis] → [DHIS2: Push Data Values]
```

This workflow:

1. Fetches patient encounters from OpenMRS for a period
2. Aggregates encounter counts by diagnosis code
3. Pushes aggregated values to a DHIS2 data set

## Options

### Common Parameters

| Parameter   | Type     | Description                  | Required                  |
| ----------- | -------- | ---------------------------- | ------------------------- |
| Resource    | Dropdown | DHIS2 resource type          | Yes                       |
| Operation   | Dropdown | Action to perform            | Yes                       |
| Return All  | Boolean  | Fetch all results (no limit) | No                        |
| Limit       | Number   | Max results (1-1000)         | No (default: 50)          |

## API Endpoints

This node uses the following DHIS2 Web API endpoints:
```
GET  /api/dataValueSets.json?dataSet={id}&orgUnit={id}&period={p}
POST /api/dataValueSets.json

GET  /api/analytics.json?dimension={dims}

GET  /api/organisationUnits/{id}.json
GET  /api/organisationUnits.json

GET  /api/tracker/trackedEntities/{id}
GET  /api/tracker/trackedEntities?trackedEntityType={id}&orgUnit={id}

GET  /api/tracker/events/{id}
GET  /api/tracker/events?program={id}&orgUnit={id}

GET  /api/programs/{id}.json
GET  /api/programs.json
```

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

## Development

### Building
```bash
npm run build
npm run dev
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Testing Locally
```bash
npm run dev
# Opens n8n with your node loaded at http://localhost:5678
```

## Troubleshooting

### Node doesn't appear in n8n

1. Verify package is installed: `npm list -g n8n-nodes-dhis2`
2. Restart n8n
3. Hard refresh browser (Ctrl+Shift+R)

### Authentication errors

- Verify Base URL does NOT have a trailing slash
- Confirm username/password are correct
- Check that the DHIS2 user has API access permissions

### Empty results

- Confirm the IDs (data set, org unit, period) exist in your DHIS2 instance
- Verify data has been entered for the requested period
- Check API permissions for the authenticated user

## Resources

- [DHIS2 Documentation](https://docs.dhis2.org/)
- [DHIS2 Web API Guide](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html)
- [DHIS2 Demo Server](https://play.dhis2.org)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [OpenMRS n8n Node](https://www.npmjs.com/package/n8n-nodes-openmrs) — Companion node for clinical data

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

Copyright (c) 2026 Monfort N. Brian

## Support

- **Issues:** [GitHub Issues](https://github.com/monfortbrian/n8n-nodes-dhis2/issues)
- **n8n Community:** [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

Built to bridge the gap between clinical systems and national health information systems. Designed for health workers, program managers, and data officers in low-resource settings.

---

**Made with ❤️ for the global health community**