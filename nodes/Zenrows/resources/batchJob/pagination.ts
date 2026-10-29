import type { INodeProperties } from 'n8n-workflow';

/**
 * Both list endpoints page with an opaque `cursor` and stop when the response
 * carries no `next_cursor`, so n8n can walk them itself and hand downstream
 * nodes one item per row rather than one item holding an array.
 */
export const cursorPagination = {
	pagination: {
		type: 'generic' as const,
		properties: {
			continue: '={{ $response.body.next_cursor !== null && $response.body.next_cursor !== undefined }}',
			request: {
				qs: {
					cursor: '={{ $response.body.next_cursor }}',
				},
			},
		},
	},
};

/** The Return All / Limit pair n8n expects on every Get Many operation. */
export const paginationFields = (operation: string): INodeProperties[] => [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: { resource: ['batchJob'], operation: [operation] } },
		routing: { send: { paginate: '={{ $value }}' } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		description: 'Max number of results to return',
		displayOptions: { show: { resource: ['batchJob'], operation: [operation], returnAll: [false] } },
		routing: { output: { maxResults: '={{ $value }}' } },
	},
];
