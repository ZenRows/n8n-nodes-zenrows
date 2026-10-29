import type { INodeProperties } from 'n8n-workflow';
import { extractOptions } from '../../shared/options';

const showOnlyForExtract = {
	resource: ['page'],
	operation: ['extract'],
};

export const pageExtractDescription: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://www.scrapingcourse.com/ecommerce/product/abominable-hoodie',
		description: 'The address of the page to read the fields from',
		displayOptions: { show: showOnlyForExtract },
		routing: { send: { type: 'query', property: 'url' } },
	},
	{
		displayName: 'Schema',
		name: 'extract',
		type: 'options',
		default: 'auto',
		description: 'Which set of fields to return for this page',
		options: [
			{
				name: 'Auto',
				value: 'auto',
				description: 'Use the schema Zenrows prepared for this domain',
			},
			{
				name: 'Native',
				value: 'native',
				description: 'Return only the fields the site itself publishes',
			},
			{
				name: 'Standard',
				value: 'standard',
				description: 'Return the common schema shared across sites of this kind',
			},
		],
		displayOptions: { show: showOnlyForExtract },
		routing: { send: { type: 'query', property: 'extract' } },
	},
	{
		displayName: 'Fields',
		name: 'extractFields',
		type: 'string',
		default: '',
		placeholder: 'price,title,reviews.rating',
		description:
			'Comma-separated fields to return, dot notated for a field inside a group. Leave it empty to get every field.',
		displayOptions: { show: showOnlyForExtract },
		routing: {
			send: {
				type: 'query',
				property: 'extract_fields',
				// n8n sets the query key whatever the value, and the API answers
				// REQS004 to an empty extract_fields. undefined drops the key.
				value: '={{ $value || undefined }}',
			},
		},
	},
	{
		...extractOptions,
		displayOptions: { show: showOnlyForExtract },
	},
];
