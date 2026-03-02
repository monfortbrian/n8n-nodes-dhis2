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
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Analytics', value: 'analytics' },
					{ name: 'Data Value Set', value: 'dataValueSet' },
					{ name: 'Event', value: 'event' },
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
				displayOptions: {
					show: {
						resource: ['dataValueSet'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['organisationUnit'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['trackedEntity'],
					},
				},
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
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
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
				displayOptions: {
					show: {
						resource: ['program'],
					},
				},
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
			// ===== DATA VALUE SET FIELDS =====
			{
				displayName: 'Data Set ID',
				name: 'dataSetId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['dataValueSet'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the data set',
			},
			{
				displayName: 'Organisation Unit ID',
				name: 'orgUnitId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['dataValueSet'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the organisation unit',
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['dataValueSet'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: '202501',
				description: 'The period in DHIS2 format (e.g. 202501 for January 2025, 2025Q1 for Q1 2025)',
			},
			{
				displayName: 'Data Values (JSON)',
				name: 'dataValues',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['dataValueSet'],
						operation: ['push'],
					},
				},
				default: '',
				description: 'The data value set payload as JSON. Must include dataSet, period, orgUnit, and dataValues array.',
			},
			// ===== ANALYTICS FIELDS =====
			{
				displayName: 'Dimension',
				name: 'dimension',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['analytics'],
						operation: ['query'],
					},
				},
				default: '',
				placeholder: 'dx:Uvn6LCg7dVU;ou:ImspTQPwCqd;pe:LAST_12_MONTHS',
				description: 'Analytics dimensions (e.g. dx:DATA_ELEMENT_ID;ou:ORG_UNIT_ID;pe:PERIOD)',
			},
			// ===== ORG UNIT FIELDS =====
			{
				displayName: 'Organisation Unit ID',
				name: 'organisationUnitId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['organisationUnit'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the organisation unit',
			},
			// ===== TRACKED ENTITY FIELDS =====
			{
				displayName: 'Tracked Entity ID',
				name: 'trackedEntityId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['trackedEntity'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the tracked entity',
			},
			{
				displayName: 'Tracked Entity Type ID',
				name: 'trackedEntityTypeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['trackedEntity'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'The ID of the tracked entity type',
			},
			{
				displayName: 'Organisation Unit ID',
				name: 'trackedEntityOrgUnit',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['trackedEntity'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'The ID of the organisation unit to filter tracked entities by',
			},
			// ===== EVENT FIELDS =====
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the event',
			},
			{
				displayName: 'Program ID',
				name: 'eventProgramId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'The ID of the program to filter events by',
			},
			{
				displayName: 'Organisation Unit ID',
				name: 'eventOrgUnit',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'The ID of the organisation unit to filter events by',
			},
			// ===== PROGRAM FIELDS =====
			{
				displayName: 'Program ID',
				name: 'programId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['program'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the program',
			},
			// ===== PAGINATION =====
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
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

				// --- Data Value Sets ---
				if (resource === 'dataValueSet') {
					if (operation === 'get') {
						const dataSetId = this.getNodeParameter('dataSetId', i) as string;
						const orgUnitId = this.getNodeParameter('orgUnitId', i) as string;
						const period = this.getNodeParameter('period', i) as string;
						endpoint = '/api/dataValueSets.json';
						qs.dataSet = dataSetId;
						qs.orgUnit = orgUnitId;
						qs.period = period;
					} else if (operation === 'push') {
						const dataValues = this.getNodeParameter('dataValues', i) as string;
						endpoint = '/api/dataValueSets.json';
						method = 'POST';
						body = JSON.parse(typeof dataValues === 'string' ? dataValues : JSON.stringify(dataValues)) as IDataObject;
					}
				}

				// --- Analytics ---
				if (resource === 'analytics') {
					if (operation === 'query') {
						const dimension = this.getNodeParameter('dimension', i) as string;
						endpoint = '/api/analytics.json';
						const dimensions = dimension.split(';');
						for (const dim of dimensions) {
							qs[`dimension`] = qs[`dimension`]
								? `${qs[`dimension`]}&dimension=${dim}`
								: dim;
						}
					}
				}

				// --- Organisation Units ---
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
							const limit = this.getNodeParameter('limit', i) as number;
							qs.pageSize = limit;
						} else {
							qs.paging = 'false';
						}
					}
				}

				// --- Tracked Entities ---
				if (resource === 'trackedEntity') {
					if (operation === 'get') {
						const trackedEntityId = this.getNodeParameter('trackedEntityId', i) as string;
						endpoint = `/api/tracker/trackedEntities/${trackedEntityId}`;
					} else if (operation === 'getAll') {
						const typeId = this.getNodeParameter('trackedEntityTypeId', i) as string;
						const orgUnit = this.getNodeParameter('trackedEntityOrgUnit', i) as string;
						endpoint = '/api/tracker/trackedEntities';
						qs.trackedEntityType = typeId;
						qs.orgUnit = orgUnit;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.pageSize = limit;
						}
					}
				}

				// --- Events ---
				if (resource === 'event') {
					if (operation === 'get') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						endpoint = `/api/tracker/events/${eventId}`;
					} else if (operation === 'getAll') {
						const programId = this.getNodeParameter('eventProgramId', i) as string;
						const orgUnit = this.getNodeParameter('eventOrgUnit', i) as string;
						endpoint = '/api/tracker/events';
						qs.program = programId;
						qs.orgUnit = orgUnit;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.pageSize = limit;
						}
					}
				}

				// --- Programs ---
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
							const limit = this.getNodeParameter('limit', i) as number;
							qs.pageSize = limit;
						} else {
							qs.paging = 'false';
						}
					}
				}

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

				// Handle DHIS2 list responses
				if (response.organisationUnits) {
					const items2 = response.organisationUnits as IDataObject[];
					returnData.push(...items2.map((item: IDataObject) => ({ json: item })));
				} else if (response.programs) {
					const items2 = response.programs as IDataObject[];
					returnData.push(...items2.map((item: IDataObject) => ({ json: item })));
				} else if (response.instances) {
					const items2 = response.instances as IDataObject[];
					returnData.push(...items2.map((item: IDataObject) => ({ json: item })));
				} else if (response.dataValues) {
					const items2 = response.dataValues as IDataObject[];
					returnData.push(...items2.map((item: IDataObject) => ({ json: item })));
				} else if (response.rows) {
					// Analytics response
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
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage =
						error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ json: { error: errorMessage } });
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