import type { INodeProperties } from 'n8n-workflow';
import { pageExtractDescription } from './extract';
import { pageScrapeDescription } from './scrape';

const showOnlyForPage = {
	resource: ['page'],
};

export const pageDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPage },
		options: [
			{
				name: 'Extract Data',
				value: 'extract',
				action: 'Extract structured data from a page',
				description: 'Return the page as named fields instead of markup, with no selectors to write',
				routing: {
					request: {
						method: 'GET',
						baseURL: 'https://api.zenrows.com/v1',
						url: '/',
					},
				},
			},
			{
				name: 'Scrape',
				value: 'scrape',
				action: 'Scrape a page',
				description: 'Fetch a page through Zenrows and return what it holds',
				routing: {
					request: {
						method: 'GET',
						baseURL: 'https://api.zenrows.com/v1',
						url: '/',
					},
					output: {
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ { "data": $response.body } }}',
								},
							},
						],
					},
				},
			},
		],
		default: 'scrape',
	},
	...pageScrapeDescription,
	...pageExtractDescription,
];
