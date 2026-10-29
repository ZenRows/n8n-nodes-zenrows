import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { batchJobDescription } from './resources/batchJob';
import { crawlDescription } from './resources/crawl';
import { pageDescription } from './resources/page';

export class Zenrows implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zenrows',
		name: 'zenrows',
		icon: { light: 'file:../../icons/zenrows.svg', dark: 'file:../../icons/zenrows.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Scrape the web through Zenrows, past the anti-bot systems in the way',
		defaults: {
			name: 'Zenrows',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'zenrowsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.zenrows.com/v1',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Batch Job',
						value: 'batchJob',
					},
					{
						name: 'Crawl',
						value: 'crawl',
					},
					{
						name: 'Page',
						value: 'page',
					},
				],
				default: 'page',
			},
			...pageDescription,
			...crawlDescription,
			...batchJobDescription,
		],
	};
}
