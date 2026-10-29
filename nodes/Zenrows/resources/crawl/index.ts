import type { INodeProperties } from 'n8n-workflow';
import {
	cursorPagination,
	endedCrawlPagination,
	paginationFields,
} from '../../shared/pagination';
import { crawlCreateDescription } from './create';
import { contentIdField, crawlIdField } from './fields';

const showOnlyForCrawl = {
	resource: ['crawl'],
};

/** Crawl shares the Fetch gateway, so the node's own base URL already fits. */
export const crawlDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCrawl },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Start a crawl',
				description: 'Walk a site from a start URL and collect the URLs it finds',
				routing: {
					request: { method: 'POST', url: '/crawls' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a crawl',
				description: 'Read a crawl, its status and how much ground it has covered',
				routing: {
					request: { method: 'GET', url: '=/crawls/{{ $parameter.crawlId }}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many crawls',
				description: 'List the crawls on this account, newest first',
				routing: {
					request: { method: 'GET', url: '/crawls' },
					operations: cursorPagination,
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'crawls' } }],
					},
				},
			},
			{
				name: 'Get Page Content',
				value: 'getPageContent',
				action: 'Get the content of a crawled page',
				description: 'Read one page a crawl kept, in the output format it was crawled with',
				routing: {
					request: {
						method: 'GET',
						url: '=/crawls/{{ $parameter.crawlId }}/contents/{{ $parameter.contentId }}',
					},
					// The page comes back as markup or Markdown, not JSON.
					output: {
						postReceive: [
							{ type: 'set', properties: { value: '={{ { "data": $response.body } }}' } },
						],
					},
				},
			},
			{
				name: 'Get Results',
				value: 'getResults',
				action: 'Get the ur ls a crawl found',
				description: 'List the URLs a crawl has kept, one item each',
				routing: {
					request: { method: 'GET', url: '=/crawls/{{ $parameter.crawlId }}' },
					operations: endedCrawlPagination,
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'results' } }],
					},
				},
			},
			{
				name: 'Stop',
				value: 'stop',
				action: 'Stop a crawl',
				description: 'End a running crawl, keeping what it has found so far',
				routing: {
					request: { method: 'POST', url: '=/crawls/{{ $parameter.crawlId }}/stop' },
				},
			},
		],
		default: 'create',
	},
	crawlIdField(['get', 'getPageContent', 'getResults', 'stop']),
	contentIdField,
	...crawlCreateDescription,
	...paginationFields('crawl', 'getAll'),
	...paginationFields('crawl', 'getResults'),
];
