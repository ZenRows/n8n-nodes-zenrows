import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZenrowsApi implements ICredentialType {
	name = 'zenrowsApi';

	displayName = 'Zenrows API';

	icon: Icon = { light: 'file:../icons/zenrows.svg', dark: 'file:../icons/zenrows.dark.svg' };

	documentationUrl = 'https://docs.zenrows.com/fetch/api-reference';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Zenrows API key, shown under Integrate on any playground page at app.zenrows.com',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.zenrows.com/v1',
			url: '/subscriptions/self/details',
			method: 'GET',
		},
	};
}
