import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from '../../shared/pagination';

export const batchJobGetResultsDescription: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['batchJob'], operation: ['getResults'] } },
		options: [
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
				routing: { send: { type: 'query', property: 'status' } },
			},
		],
	},
	// GET /jobs/{id}/results takes status and cursor only, so Limit can do
	// nothing but trim what came back.
	...paginationFields('batchJob', 'getResults', null),
];
