import type { INodeProperties } from 'n8n-workflow';

/** The Job ID field, shown for every operation that acts on one job. */
export const jobIdField = (operations: string[]): INodeProperties => ({
	displayName: 'Job ID',
	name: 'jobId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID the job was given when it was created',
	displayOptions: { show: { resource: ['batchJob'], operation: operations } },
});
