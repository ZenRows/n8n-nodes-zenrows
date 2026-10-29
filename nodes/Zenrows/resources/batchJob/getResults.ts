import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from './pagination';

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
		displayOptions: { show: { resource: ['batchJob'], operation: ['getResults'] } },
		routing: { send: { type: 'query', property: 'status' } },
	},
	...paginationFields('getResults'),
];
