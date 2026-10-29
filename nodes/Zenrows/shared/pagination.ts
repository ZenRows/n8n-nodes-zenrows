import type { INodeProperties } from 'n8n-workflow';

/**
 * Batch's list endpoints end: the docs say to read until `next_cursor` is
 * null, so following it is enough.
 */
export const cursorPagination = {
	pagination: {
		type: 'generic' as const,
		properties: {
			continue:
				'={{ $response.body.next_cursor !== null && $response.body.next_cursor !== undefined }}',
			request: {
				qs: {
					cursor: '={{ $response.body.next_cursor }}',
				},
			},
		},
	},
};

/**
 * Reading a crawl is the dangerous one. `next_cursor` is never null while the
 * crawl is still running, or while a stopped crawl is still draining the pages
 * it fetched before the stop, and n8n's generic pagination has no request cap
 * of its own: it loops until `continue` goes false. So only a crawl that has
 * reached a terminal state is followed, and anything else returns the page it
 * already has.
 */
export const endedCrawlPagination = {
	pagination: {
		type: 'generic' as const,
		properties: {
			continue:
				'={{ $response.body.next_cursor !== null && $response.body.next_cursor !== undefined && ["completed", "failed"].includes($response.body.status) }}',
			request: {
				qs: {
					cursor: '={{ $response.body.next_cursor }}',
				},
			},
		},
	},
};

/** The Return All / Limit pair n8n expects on every Get Many operation. */
export const paginationFields = (resource: string, operation: string): INodeProperties[] => [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: { resource: [resource], operation: [operation] } },
		routing: { send: { paginate: '={{ $value }}' } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		description: 'Max number of results to return',
		displayOptions: {
			show: { resource: [resource], operation: [operation], returnAll: [false] },
		},
		routing: { output: { maxResults: '={{ $value }}' } },
	},
];
