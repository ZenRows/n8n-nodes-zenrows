import type { INodeProperties } from 'n8n-workflow';

/** Shown for every operation that acts on one crawl. */
export const crawlIdField = (operations: string[]): INodeProperties => ({
	displayName: 'Crawl ID',
	name: 'crawlId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID the crawl was given when it started',
	displayOptions: { show: { resource: ['crawl'], operation: operations } },
});

export const contentIdField: INodeProperties = {
	displayName: 'Content ID',
	name: 'contentId',
	type: 'string',
	required: true,
	default: '',
	description: 'Taken from a result\'s content_url, which appears once its content_status is fetched',
	displayOptions: { show: { resource: ['crawl'], operation: ['getPageContent'] } },
};
