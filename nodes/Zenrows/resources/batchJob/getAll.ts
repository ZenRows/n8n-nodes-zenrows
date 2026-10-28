import type { INodeProperties } from 'n8n-workflow';

export const batchJobGetManyDescription: INodeProperties[] = [
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'The next_cursor from the previous page. Leave it empty for the first page.',
		displayOptions: { show: { resource: ['batchJob'], operation: ['getAll'] } },
		routing: { send: { type: 'query', property: 'cursor' } },
	},
];
