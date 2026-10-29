import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['crawl'],
	operation: ['create'],
};

export const crawlCreateDescription: INodeProperties[] = [
	{
		displayName: 'Start URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://www.scrapingcourse.com/ecommerce/',
		description:
			'Where the crawl begins. It stays on this URL\'s domain, subdomains included, and never follows a link that would change something on the site.',
		displayOptions: { show: showOnlyForCreate },
		routing: { send: { type: 'body', property: 'url' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: showOnlyForCreate },
		options: [
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1, maxValue: 100000 },
				description:
					'How many link steps to follow. At 1 the crawl returns the links on the start page; at 2 it also opens those pages. Leave it out to follow links until a limit stops the crawl.',
				routing: { send: { type: 'body', property: 'depth' } },
			},
			{
				displayName: 'Exclude Patterns',
				name: 'excludePatterns',
				type: 'string',
				default: [],
				typeOptions: { multipleValues: true },
				placeholder: '/cart/',
				description: 'Drops a URL containing any of these texts, even one an include pattern matched',
				routing: { send: { type: 'body', property: 'exclude_patterns' } },
			},
			{
				displayName: 'Include Patterns',
				name: 'includePatterns',
				type: 'string',
				default: [],
				typeOptions: { multipleValues: true },
				placeholder: '/product/',
				description: 'Keeps a URL only if it contains at least one of these texts, and opens only those',
				routing: { send: { type: 'body', property: 'include_patterns' } },
			},
			{
				displayName: 'Max Items',
				name: 'maxItems',
				type: 'number',
				default: 100,
				typeOptions: { minValue: 1, maxValue: 100000 },
				description: 'Stops the crawl once it has kept this many URLs',
				routing: { send: { type: 'body', property: 'max_items' } },
			},
			{
				displayName: 'Max Pages',
				name: 'maxPages',
				type: 'number',
				default: 100,
				typeOptions: { minValue: 1, maxValue: 100000 },
				description:
					'Stops the crawl once it has fetched this many pages. Each page is one Fetch request at 1 to 25 credits, so this is what caps the cost.',
				routing: { send: { type: 'body', property: 'max_pages' } },
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				default: 'markdown',
				description:
					'Return each kept page as well as its URL. Every kept page costs a fetch of its own.',
				options: [
					{ name: 'HTML', value: 'html' },
					{ name: 'Markdown', value: 'markdown' },
				],
				routing: { send: { type: 'body', property: 'output_format' } },
			},
		],
	},
];
