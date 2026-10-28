import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetResults = {
	resource: ['batchJob'],
	operation: ['getResults'],
};

export const batchJobGetResultsDescription: INodeProperties[] = [
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'successful',
		description: 'Which tasks to list',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Failed', value: 'failed' },
			{ name: 'Successful', value: 'successful' },
		],
		displayOptions: { show: showOnlyForGetResults },
		routing: { send: { type: 'query', property: 'status' } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'The next_cursor from the previous page. Leave it empty for the first page.',
		displayOptions: { show: showOnlyForGetResults },
		routing: { send: { type: 'query', property: 'cursor' } },
	},
];
