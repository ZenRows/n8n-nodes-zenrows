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

/**
 * How many results one request may bring back.
 *
 * A number is the endpoint's documented maximum for `limit`. `null` means the
 * endpoint takes no `limit` at all, so its own page size decides.
 */
type LimitCeiling = number | null;

/**
 * The Return All / Limit pair n8n expects on every Get Many operation.
 *
 * `output.maxResults` only trims a reply the node already holds. Unless `limit`
 * goes out in the query too, the request asks for the endpoint's own page size,
 * and a Limit above it quietly returns less than it asked for.
 */
export const paginationFields = (
	resource: string,
	operation: string,
	ceiling: LimitCeiling,
): INodeProperties[] => [
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
		typeOptions: { minValue: 1, ...(ceiling === null ? {} : { maxValue: ceiling }) },
		description: 'Max number of results to return',
		displayOptions: {
			show: { resource: [resource], operation: [operation], returnAll: [false] },
		},
		routing:
			ceiling === null
				? { output: { maxResults: '={{ $value }}' } }
				: {
						send: { type: 'query', property: 'limit' },
						output: { maxResults: '={{ $value }}' },
					},
	},
];
