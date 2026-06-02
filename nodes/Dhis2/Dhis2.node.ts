import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class Dhis2 implements INodeType {
	usableAsTool = true;

	description: INodeTypeDescription = {
		displayName: 'DHIS2',
		name: 'dhis2',
		icon: 'file:dhis2.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with DHIS2 Web API',
		defaults: {
			name: 'DHIS2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'dhis2Api',
				required: true,
			},
		],
		properties: [
			// ===== RESOURCE =====
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Analytics', value: 'analytics' },
					{ name: 'Data Value Set', value: 'dataValueSet' },
					{ name: 'Enrollment', value: 'enrollment' },
					{ name: 'Event', value: 'event' },
					{ name: 'FHIR', value: 'fhir' },
					{ name: 'Organisation Unit', value: 'organisationUnit' },
					{ name: 'Program', value: 'program' },
					{ name: 'Tracked Entity', value: 'trackedEntity' },
				],
				default: 'dataValueSet',
			},

			// ===== OPERATIONS =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['analytics'] } },
				options: [
					{
						name: 'Query',
						value: 'query',
						description: 'Query analytics data',
						action: 'Query analytics',
					},
				],
				default: 'query',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['dataValueSet'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get data values for a data set',
						action: 'Get data values',
					},
					{
						name: 'Push',
						value: 'push',
						description: 'Push data values to DHIS2',
						action: 'Push data values',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['enrollment'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Enroll a tracked entity into a program',
						action: 'Create an enrollment',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an enrollment by ID',
						action: 'Get an enrollment',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['event'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a tracker event',
						action: 'Create an event',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an event by ID',
						action: 'Get an event',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many events',
						action: 'Get many events',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['fhir'] } },
				options: [
					{
						name: 'Read Patient',
						value: 'readPatient',
						description: 'Read a FHIR Patient by ID',
						action: 'Read a FHIR patient',
					},
					{
						name: 'Search Patients',
						value: 'searchPatients',
						description: 'Search FHIR Patients by identifier or name',
						action: 'Search FHIR patients',
					},
					{
						name: 'Create Observation',
						value: 'createObservation',
						description: 'Post a FHIR Observation to DHIS2',
						action: 'Create a FHIR observation',
					},
					{
						name: 'Search Observations',
						value: 'searchObservations',
						description: 'Search FHIR Observations by patient or code',
						action: 'Search FHIR observations',
					},
				],
				default: 'readPatient',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['organisationUnit'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an organisation unit by ID',
						action: 'Get an organisation unit',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many organisation units',
						action: 'Get many organisation units',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['program'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a program by ID',
						action: 'Get a program',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many programs',
						action: 'Get many programs',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['trackedEntity'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a tracked entity by ID',
						action: 'Get a tracked entity',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many tracked entities',
						action: 'Get many tracked entities',
					},
				],
				default: 'get',
			},

			// ===== ANALYTICS FIELDS =====
			{
				displayName: 'Dimension',
				name: 'dimension',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['analytics'], operation: ['query'] } },
				default: '',
				placeholder: 'dx:Uvn6LCg7dVU;ou:ImspTQPwCqd;pe:LAST_12_MONTHS',
				description: 'Semicolon-separated analytics dimensions. Must include dx (data element/indicator), ou (org unit), and pe (period).',
			},

			// ===== DATA VALUE SET FIELDS =====
			{
				displayName: 'Data Set ID',
				name: 'dataSetId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['dataValueSet'], operation: ['get'] } },
				default: '',
				description: 'The UID of the data set',
			},
			{
				displayName: 'Organisation Unit ID',
				name: 'orgUnitId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['dataValueSet'], operation: ['get'] } },
				default: '',
				description: 'The UID of the organisation unit',
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['dataValueSet'], operation: ['get'] } },
				default: '',
				placeholder: '202501',
				description: 'Period in DHIS2 format (e.g. 202501, 2025Q1)',
			},
			{
				displayName: 'Data Values (JSON)',
				name: 'dataValues',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['dataValueSet'], operation: ['push'] } },
				default: '',
				description: 'Full data value set payload. Must include dataSet, period, orgUnit, and dataValues array.',
			},

			// ===== ENROLLMENT FIELDS =====
			{
				displayName: 'Enrollment Payload (JSON)',
				name: 'enrollmentPayload',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['enrollment'], operation: ['create'] } },
				default: '{\n  "trackedEntity": "TEI_UID",\n  "orgUnit": "ORG_UNIT_UID",\n  "program": "PROGRAM_UID",\n  "enrolledAt": "2024-01-01",\n  "occurredAt": "2024-01-01"\n}',
				description: 'Enrollment payload. Must include trackedEntity, orgUnit, program, enrolledAt.',
			},
			{
				displayName: 'Enrollment ID',
				name: 'enrollmentId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['enrollment'], operation: ['get'] } },
				default: '',
				description: 'The UID of the enrollment',
			},

			// ===== EVENT FIELDS =====
			{
				displayName: 'Event Payload (JSON)',
				name: 'eventPayload',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['create'] } },
				default: '{\n  "program": "PROGRAM_UID",\n  "programStage": "PROGRAM_STAGE_UID",\n  "orgUnit": "ORG_UNIT_UID",\n  "occurredAt": "2024-01-01",\n  "status": "COMPLETED",\n  "dataValues": [\n    { "dataElement": "DATA_ELEMENT_UID", "value": "value" }\n  ]\n}',
				description: 'Tracker event payload. Must include program, programStage, orgUnit, occurredAt. Optionally include enrollment and dataValues.',
			},
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['get'] } },
				default: '',
				description: 'The UID of the event',
			},
			{
				displayName: 'Program ID',
				name: 'eventProgramId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['getAll'] } },
				default: '',
				description: 'The UID of the program to filter events by',
			},
			{
				displayName: 'Organisation Unit ID',
				name: 'eventOrgUnit',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['event'], operation: ['getAll'] } },
				default: '',
				description: 'The UID of the organisation unit to filter events by',
			},

			// ===== FHIR FIELDS =====
			{
				displayName: 'Patient ID',
				name: 'fhirPatientId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['fhir'], operation: ['readPatient'] } },
				default: '',
				description: 'FHIR Patient resource ID (maps to DHIS2 tracked entity UID)',
			},
			{
				displayName: 'Search Parameter',
				name: 'fhirPatientSearch',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['fhir'], operation: ['searchPatients'] } },
				default: '',
				placeholder: 'identifier=PATIENT_ID',
				description: 'FHIR search param as key=value (e.g. identifier=ABC123 or name=John)',
			},
			{
				displayName: 'Observation (JSON)',
				name: 'fhirObservation',
				type: 'json',
				required: true,
				displayOptions: { show: { resource: ['fhir'], operation: ['createObservation'] } },
				default: '{\n  "resourceType": "Observation",\n  "status": "final",\n  "code": { "coding": [{ "system": "http://loinc.org", "code": "8480-6" }] },\n  "subject": { "reference": "Patient/PATIENT_ID" },\n  "valueQuantity": { "value": 120, "unit": "mmHg" }\n}',
				description: 'Full FHIR Observation resource as JSON',
			},
			{
				displayName: 'Patient Reference',
				name: 'fhirObsPatient',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['fhir'], operation: ['searchObservations'] } },
				default: '',
				placeholder: 'Patient/PATIENT_ID',
				description: 'Filter observations by patient reference (e.g. Patient/ABC123)',
			},

			// ===== ORGANISATION UNIT FIELDS =====
			{
				displayName: 'Organisation Unit ID',
				name: 'organisationUnitId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['organisationUnit'], operation: ['get'] } },
				default: '',
				description: 'The UID of the organisation unit',
			},

			// ===== PROGRAM FIELDS =====
			{
				displayName: 'Program ID',
				name: 'programId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['program'], operation: ['get'] } },
				default: '',
				description: 'The UID of the program',
			},

			// ===== TRACKED ENTITY FIELDS =====
			{
				displayName: 'Tracked Entity ID',
				name: 'trackedEntityId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['trackedEntity'], operation: ['get'] } },
				default: '',
				description: 'The UID of the tracked entity',
			},
			{
				displayName: 'Tracked Entity Type ID',
				name: 'trackedEntityTypeId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['trackedEntity'], operation: ['getAll'] } },
				default: '',
				description: 'The UID of the tracked entity type',
			},
			{
				displayName: 'Organisation Unit ID',
				name: 'trackedEntityOrgUnit',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['trackedEntity'], operation: ['getAll'] } },
				default: '',
				description: 'The UID of the organisation unit to filter tracked entities by',
			},

			// ===== PAGINATION =====
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: { show: { operation: ['getAll'] } },
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: { show: { operation: ['getAll'], returnAll: [false] } },
				typeOptions: { minValue: 1, maxValue: 1000 },
				default: 50,
				description: 'Max number of results to return',
			},
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('dhis2Api');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let endpoint = '';
				let method: 'GET' | 'POST' = 'GET';
				const qs: IDataObject = {};
				let body: IDataObject | undefined;

				// ----------------------------------------------------------------
				// Analytics
				// n8n serializes arrays as dimension[0]=x&dimension[1]=y which
				// DHIS2 rejects. Build the query string manually to get repeated
				// keys: dimension=dx:X&dimension=ou:Y&dimension=pe:Z
				// ----------------------------------------------------------------
				if (resource === 'analytics') {
					if (operation === 'query') {
						const dimension = this.getNodeParameter('dimension', i) as string;
						const dims = dimension.split(';').map((d) => d.trim()).filter(Boolean);
						const queryString = dims.map((d) => `dimension=${encodeURIComponent(d)}`).join('&');
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'dhis2Api',
							{
								method: 'GET',
								url: `${baseUrl}/api/analytics.json?${queryString}`,
								json: true,
							},
						);
						if (response.rows) {
							const headers = response.headers as Array<{ name: string }>;
							const rows = response.rows as string[][];
							for (const row of rows) {
								const obj: IDataObject = {};
								for (let j = 0; j < headers.length; j++) {
									obj[headers[j].name] = row[j];
								}
								returnData.push({ json: obj });
							}
						} else {
							returnData.push({ json: response as IDataObject });
						}
						continue;
					}
				}

				// ----------------------------------------------------------------
				// Data Value Set
				// ----------------------------------------------------------------
				if (resource === 'dataValueSet') {
					if (operation === 'get') {
						endpoint = '/api/dataValueSets.json';
						qs.dataSet = this.getNodeParameter('dataSetId', i) as string;
						qs.orgUnit = this.getNodeParameter('orgUnitId', i) as string;
						qs.period = this.getNodeParameter('period', i) as string;
					} else if (operation === 'push') {
						const raw = this.getNodeParameter('dataValues', i) as string;
						endpoint = '/api/dataValueSets.json';
						method = 'POST';
						body = JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw)) as IDataObject;
					}
				}

				// ----------------------------------------------------------------
				// Enrollment
				// ----------------------------------------------------------------
				if (resource === 'enrollment') {
					if (operation === 'create') {
						const raw = this.getNodeParameter('enrollmentPayload', i) as string;
						endpoint = '/api/tracker';
						method = 'POST';
						body = {
							enrollments: [
								JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw)),
							],
						} as IDataObject;
					} else if (operation === 'get') {
						const enrollmentId = this.getNodeParameter('enrollmentId', i) as string;
						endpoint = `/api/tracker/enrollments/${enrollmentId}`;
					}
				}

				// ----------------------------------------------------------------
				// Event
				// ----------------------------------------------------------------
				if (resource === 'event') {
					if (operation === 'create') {
						const raw = this.getNodeParameter('eventPayload', i) as string;
						endpoint = '/api/tracker';
						method = 'POST';
						body = {
							events: [
								JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw)),
							],
						} as IDataObject;
					} else if (operation === 'get') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						endpoint = `/api/tracker/events/${eventId}`;
					} else if (operation === 'getAll') {
						endpoint = '/api/tracker/events';
						qs.program = this.getNodeParameter('eventProgramId', i) as string;
						qs.orgUnit = this.getNodeParameter('eventOrgUnit', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							qs.pageSize = this.getNodeParameter('limit', i) as number;
						}
					}
				}

				// ----------------------------------------------------------------
				// FHIR - hits /fhir/* separately, returns early to skip shared handler
				// ----------------------------------------------------------------
				if (resource === 'fhir') {
					const fhirBase = `${baseUrl}/fhir`;

					if (operation === 'readPatient') {
						const patientId = this.getNodeParameter('fhirPatientId', i) as string;
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'dhis2Api',
							{ method: 'GET', url: `${fhirBase}/Patient/${patientId}`, json: true },
						);
						returnData.push({ json: response as IDataObject });
						continue;
					}

					if (operation === 'searchPatients') {
						const searchParam = this.getNodeParameter('fhirPatientSearch', i) as string;
						const [paramKey, paramValue] = searchParam.split('=');
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'dhis2Api',
							{
								method: 'GET',
								url: `${fhirBase}/Patient`,
								qs: { [paramKey.trim()]: paramValue?.trim() },
								json: true,
							},
						);
						const bundle = response as IDataObject;
						const entries = (bundle.entry as IDataObject[]) ?? [];
						returnData.push(...entries.map((e) => ({ json: (e.resource as IDataObject) ?? e })));
						continue;
					}

					if (operation === 'createObservation') {
						const raw = this.getNodeParameter('fhirObservation', i) as string;
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'dhis2Api',
							{
								method: 'POST',
								url: `${fhirBase}/Observation`,
								body: JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw)),
								json: true,
							},
						);
						returnData.push({ json: response as IDataObject });
						continue;
					}

					if (operation === 'searchObservations') {
						const patient = this.getNodeParameter('fhirObsPatient', i) as string;
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'dhis2Api',
							{
								method: 'GET',
								url: `${fhirBase}/Observation`,
								qs: { patient },
								json: true,
							},
						);
						const bundle = response as IDataObject;
						const entries = (bundle.entry as IDataObject[]) ?? [];
						returnData.push(...entries.map((e) => ({ json: (e.resource as IDataObject) ?? e })));
						continue;
					}
				}

				// ----------------------------------------------------------------
				// Organisation Unit
				// ----------------------------------------------------------------
				if (resource === 'organisationUnit') {
					if (operation === 'get') {
						const orgUnitId = this.getNodeParameter('organisationUnitId', i) as string;
						endpoint = `/api/organisationUnits/${orgUnitId}.json`;
						qs.fields = '*';
					} else if (operation === 'getAll') {
						endpoint = '/api/organisationUnits.json';
						qs.fields = 'id,displayName,level,parent[id,displayName]';
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							qs.pageSize = this.getNodeParameter('limit', i) as number;
						} else {
							qs.paging = 'false';
						}
					}
				}

				// ----------------------------------------------------------------
				// Program
				// ----------------------------------------------------------------
				if (resource === 'program') {
					if (operation === 'get') {
						const programId = this.getNodeParameter('programId', i) as string;
						endpoint = `/api/programs/${programId}.json`;
						qs.fields = '*';
					} else if (operation === 'getAll') {
						endpoint = '/api/programs.json';
						qs.fields = 'id,displayName,programType,trackedEntityType[id,displayName]';
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							qs.pageSize = this.getNodeParameter('limit', i) as number;
						} else {
							qs.paging = 'false';
						}
					}
				}

				// ----------------------------------------------------------------
				// Tracked Entity
				// ----------------------------------------------------------------
				if (resource === 'trackedEntity') {
					if (operation === 'get') {
						const trackedEntityId = this.getNodeParameter('trackedEntityId', i) as string;
						endpoint = `/api/tracker/trackedEntities/${trackedEntityId}`;
					} else if (operation === 'getAll') {
						endpoint = '/api/tracker/trackedEntities';
						qs.trackedEntityType = this.getNodeParameter('trackedEntityTypeId', i) as string;
						qs.orgUnit = this.getNodeParameter('trackedEntityOrgUnit', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							qs.pageSize = this.getNodeParameter('limit', i) as number;
						}
					}
				}

				// ----------------------------------------------------------------
				// Shared HTTP handler (all non-FHIR, non-analytics resources)
				// ----------------------------------------------------------------
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'dhis2Api',
					{
						method,
						url: `${baseUrl}${endpoint}`,
						qs,
						json: true,
						...(body ? { body } : {}),
					},
				);

				// Unwrap known DHIS2 list envelopes
				if (response.organisationUnits) {
					returnData.push(...(response.organisationUnits as IDataObject[]).map((item: IDataObject) => ({ json: item })));
				} else if (response.programs) {
					returnData.push(...(response.programs as IDataObject[]).map((item: IDataObject) => ({ json: item })));
				} else if (response.instances) {
					returnData.push(...(response.instances as IDataObject[]).map((item: IDataObject) => ({ json: item })));
				} else if (response.dataValues) {
					returnData.push(...(response.dataValues as IDataObject[]).map((item: IDataObject) => ({ json: item })));
				} else {
					returnData.push({ json: response as IDataObject });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : 'Unknown error' },
					});
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : new Error(String(error)),
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}
}