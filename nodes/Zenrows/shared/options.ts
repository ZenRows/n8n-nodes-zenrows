import type { INodeProperties } from 'n8n-workflow';

/**
 * One property per Zenrows query parameter. The API names are snake_case, the
 * n8n names are camelCase, and `routing.send.property` is the only place the
 * two meet.
 */

const allowedStatusCodes: INodeProperties = {
	displayName: 'Allowed Status Codes',
	name: 'allowedStatusCodes',
	type: 'string',
	default: '',
	placeholder: '404,500',
	description: 'Comma-separated status codes whose page content is returned instead of an error. Useful when the page you want is itself an error page.',
	routing: { send: { type: 'query', property: 'allowed_status_codes' } },
};

const blockResources: INodeProperties = {
	displayName: 'Block Resources',
	name: 'blockResources',
	type: 'string',
	default: '',
	placeholder: 'image,font,stylesheet',
	description: 'Comma-separated resource types the browser should skip, which makes the request faster and cheaper in bandwidth',
	routing: { send: { type: 'query', property: 'block_resources' } },
};

const cssExtractor: INodeProperties = {
	displayName: 'CSS Extractor',
	name: 'cssExtractor',
	type: 'string',
	default: '',
	placeholder: '{"title": "h1", "price": ".price"}',
	description: 'A JSON object mapping the field names you want to the CSS selectors that hold them',
	routing: { send: { type: 'query', property: 'css_extractor' } },
};

const customHeaders: INodeProperties = {
	displayName: 'Custom Headers',
	name: 'customHeaders',
	type: 'boolean',
	default: false,
	description: 'Whether headers sent to this node are forwarded on to the target site',
	routing: { send: { type: 'query', property: 'custom_headers' } },
};

const jsInstructions: INodeProperties = {
	displayName: 'JS Instructions',
	name: 'jsInstructions',
	type: 'string',
	default: '',
	placeholder: '[{"click": ".load-more"}, {"wait": 500}]',
	description: 'A JSON array of browser actions to run before the page is returned, such as clicks, scrolls and waits. Requires JS Rendering.',
	routing: { send: { type: 'query', property: 'js_instructions' } },
};

const jsRender: INodeProperties = {
	displayName: 'JS Rendering',
	name: 'jsRender',
	type: 'boolean',
	default: false,
	description: 'Whether to load the page in a headless browser so its JavaScript runs. Needed for single page apps and anything that fills itself in after load.',
	routing: { send: { type: 'query', property: 'js_render' } },
};

const jsonResponse: INodeProperties = {
	displayName: 'JSON Response',
	name: 'jsonResponse',
	type: 'boolean',
	default: false,
	description:
		'Whether to return the network requests the page made alongside its content, which exposes the APIs behind it',
	routing: { send: { type: 'query', property: 'json_response' } },
};

const originalStatus: INodeProperties = {
	displayName: 'Original Status',
	name: 'originalStatus',
	type: 'boolean',
	default: false,
	description: 'Whether to return the status code the target site answered with rather than the Zenrows one',
	routing: { send: { type: 'query', property: 'original_status' } },
};

const outputs: INodeProperties = {
	displayName: 'Outputs',
	name: 'outputs',
	type: 'string',
	default: '',
	placeholder: 'emails,phone_numbers',
	description: 'Comma-separated data types to pull out of the HTML and return on their own',
	routing: { send: { type: 'query', property: 'outputs' } },
};

const premiumProxy: INodeProperties = {
	displayName: 'Premium Proxy',
	name: 'premiumProxy',
	type: 'boolean',
	default: false,
	description:
		'Whether to route the request through residential IPs, which gets past most anti-bot systems',
	routing: { send: { type: 'query', property: 'premium_proxy' } },
};

const proxyCountry: INodeProperties = {
	displayName: 'Proxy Country',
	name: 'proxyCountry',
	type: 'string',
	default: '',
	placeholder: 'us',
	description: 'Two letter country code for the IP the request goes out from. Requires Premium Proxy.',
	routing: { send: { type: 'query', property: 'proxy_country' } },
};

const responseType: INodeProperties = {
	displayName: 'Response Type',
	name: 'responseType',
	type: 'options',
	default: 'markdown',
	description: 'Convert the page before returning it, instead of handing back raw HTML',
	options: [
		{ name: 'Markdown', value: 'markdown' },
		{ name: 'PDF', value: 'pdf' },
		{ name: 'Plaintext', value: 'plaintext' },
	],
	routing: { send: { type: 'query', property: 'response_type' } },
};

const screenshot: INodeProperties = {
	displayName: 'Screenshot',
	name: 'screenshot',
	type: 'boolean',
	default: false,
	description: 'Whether to return an image of the page instead of its markup. Requires JS Rendering.',
	routing: { send: { type: 'query', property: 'screenshot' } },
};

const sessionId: INodeProperties = {
	displayName: 'Session ID',
	name: 'sessionId',
	type: 'number',
	default: 0,
	description:
		'Send the same number on several requests to keep the same IP for up to ten minutes, which multi step flows need',
	routing: { send: { type: 'query', property: 'session_id' } },
};

const wait: INodeProperties = {
	displayName: 'Wait (Ms)',
	name: 'wait',
	type: 'number',
	default: 0,
	description: 'How long to wait after the page loads, in milliseconds. Requires JS Rendering.',
	routing: { send: { type: 'query', property: 'wait' } },
};

const waitFor: INodeProperties = {
	displayName: 'Wait For Selector',
	name: 'waitFor',
	type: 'string',
	default: '',
	placeholder: '.product-price',
	description: 'A CSS selector that has to appear in the DOM before the page is returned. Requires JS Rendering.',
	routing: { send: { type: 'query', property: 'wait_for' } },
};

/** Everything Fetch accepts, for the Scrape operation. */
export const scrapeOptions: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add option',
	default: {},
	options: [
		allowedStatusCodes,
		blockResources,
		cssExtractor,
		customHeaders,
		jsInstructions,
		jsRender,
		jsonResponse,
		originalStatus,
		outputs,
		premiumProxy,
		proxyCountry,
		responseType,
		screenshot,
		sessionId,
		wait,
		waitFor,
	],
};

/**
 * The subset that still makes sense once the page is being turned into
 * structured fields. Nothing here changes the output format.
 */
export const extractOptions: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add option',
	default: {},
	options: [
		customHeaders,
		jsInstructions,
		jsRender,
		premiumProxy,
		proxyCountry,
		sessionId,
		wait,
		waitFor,
	],
};
