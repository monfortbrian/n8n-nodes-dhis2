import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Dhis2Api implements ICredentialType {
	name = 'dhis2Api';

	displayName = 'DHIS2 API';

	icon = { light: 'file:dhis2.svg', dark: 'file:dhis2.svg' } as const;

	documentationUrl = 'https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/introduction.html';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://play.dhis2.org/40.4.0',
			description: 'The base URL of your DHIS2 instance (e.g. https://play.dhis2.org/40.4.0)',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Your DHIS2 username',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your DHIS2 password',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/me.json',
			method: 'GET',
		},
	};
}