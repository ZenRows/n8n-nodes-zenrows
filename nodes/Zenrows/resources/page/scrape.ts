import type { INodeProperties } from 'n8n-workflow';
import { scrapeOptions } from '../../shared/options';

const showOnlyForScrape = {
	resource: ['page'],
	operation: ['scrape'],
};

export const pageScrapeDescription: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://www.scrapingcourse.com/ecommerce/',
		description: 'The address of the page to fetch',
		displayOptions: { show: showOnlyForScrape },
		routing: { send: { type: 'query', property: 'url' } },
	},
	{
		displayName: 'Stealth Mode',
		name: 'mode',
		type: 'options',
		default: 'auto',
		description: 'How much work Zenrows puts into getting past the site. Adaptive is the cheaper default because a failed attempt is not charged.',
		options: [
			{
				name: 'Adaptive',
				value: 'auto',
				description:
					'Start with the cheapest setup that could work and escalate only when the site pushes back',
			},
			{
				name: 'Manual',
				value: 'manual',
				description: 'Set JS Rendering and Premium Proxy yourself under Options',
			},
		],
		displayOptions: { show: showOnlyForScrape },
		routing: {
			send: {
				type: 'query',
				property: 'mode',
				value: '={{ $value === "auto" ? "auto" : undefined }}',
			},
		},
	},
	{
		...scrapeOptions,
		displayOptions: { show: showOnlyForScrape },
	},
];
