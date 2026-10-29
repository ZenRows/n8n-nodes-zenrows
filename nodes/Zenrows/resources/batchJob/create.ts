import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['batchJob'],
	operation: ['create'],
};

/**
 * Batch nests the scrape settings under `zenrows_params` and wants their
 * values as strings, so these carry dotted routing paths rather than the
 * flat query parameters the Page resource uses.
 */
const jobOptions: INodeProperties = {
	displayName: 'Scrape Settings',
	name: 'zenrowsParams',
	type: 'collection',
	placeholder: 'Add setting',
	default: {},
	description: 'Applied to every URL in the job',
	options: [
		{
			displayName: 'CSS Extractor',
			name: 'cssExtractor',
			type: 'string',
			default: '',
			placeholder: '{"title": "h1", "price": ".price"}',
			description:
				'A JSON object mapping the field names you want to the CSS selectors that hold them',
			routing: { send: { type: 'body', property: 'zenrows_params.css_extractor' } },
		},
		{
			displayName: 'JS Rendering',
			name: 'jsRender',
			type: 'boolean',
			default: false,
			description: 'Whether to load each page in a headless browser so its JavaScript runs',
			routing: {
				send: {
					type: 'body',
					property: 'zenrows_params.js_render',
					value: '={{ $value ? "true" : "false" }}',
				},
			},
		},
		{
			displayName: 'Premium Proxy',
			name: 'premiumProxy',
			type: 'boolean',
			default: false,
			description: 'Whether to route every request through residential IPs',
			routing: {
				send: {
					type: 'body',
					property: 'zenrows_params.premium_proxy',
					value: '={{ $value ? "true" : "false" }}',
				},
			},
		},
		{
			displayName: 'Proxy Country',
			name: 'proxyCountry',
			type: 'string',
			default: '',
			placeholder: 'us',
			description: 'Two letter country code for the IP the requests go out from. Requires Premium Proxy.',
			routing: { send: { type: 'body', property: 'zenrows_params.proxy_country' } },
		},
		{
			displayName: 'Response Type',
			name: 'responseType',
			type: 'options',
			default: 'markdown',
			description: 'Convert each page before storing it, instead of keeping raw HTML',
			options: [
				{ name: 'Markdown', value: 'markdown' },
				{ name: 'PDF', value: 'pdf' },
				{ name: 'Plaintext', value: 'plaintext' },
			],
			routing: { send: { type: 'body', property: 'zenrows_params.response_type' } },
		},
		{
			displayName: 'Wait For Selector',
			name: 'waitFor',
			type: 'string',
			default: '',
			placeholder: '.product-price',
			description: 'A CSS selector that has to appear in the DOM before a page is stored. Requires JS Rendering.',
			routing: { send: { type: 'body', property: 'zenrows_params.wait_for' } },
		},
	],
};

export const batchJobCreateDescription: INodeProperties[] = [
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		placeholder: 'https://example.com/one\nhttps://example.com/two',
		description: 'One URL per line. Each one becomes a task in the job.',
		displayOptions: { show: showOnlyForCreate },
		routing: {
			send: {
				type: 'body',
				property: 'tasks',
				// Escaped twice on purpose: TypeScript would turn a single \\n into a
				// real line break, and n8n would then parse an expression with a
				// newline inside a string literal. The regex also takes CRLF.
				value:
					'={{ $value.split(/\\r?\\n/).map((u) => u.trim()).filter((u) => u).map((u) => ({ url: u })) }}',
			},
		},
	},
	{
		...jobOptions,
		displayOptions: { show: showOnlyForCreate },
	},
];
