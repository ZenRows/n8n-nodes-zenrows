import type { INodeProperties } from 'n8n-workflow';
import { batchJobCreateDescription } from './create';
import { batchJobGetManyDescription } from './getAll';
import { batchJobGetResultsDescription } from './getResults';
import { jobIdField } from './jobId';
import { cursorPagination } from '../../shared/pagination';

const showOnlyForBatchJob = {
	resource: ['batchJob'],
};

/** Batch lives on its own host, so every operation here overrides the base URL. */
const baseURL = 'https://async.api.zenrows.com/v1';

export const batchJobDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForBatchJob },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a batch job',
				description: 'Queue a list of URLs to be scraped in the background',
				routing: {
					request: {
						method: 'POST',
						baseURL,
						url: '/jobs',
						body: {
							type: 'regular',
							status: 'closed',
						},
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a batch job',
				description: 'Remove a job and the results it still holds',
				routing: {
					request: {
						method: 'DELETE',
						baseURL,
						url: '=/jobs/{{ $parameter.jobId }}',
					},
					// The API answers a delete with an empty body, which would
					// reach the workflow as a blank item.
					output: {
						postReceive: [
							{ type: 'set', properties: { value: '={{ { "success": true } }}' } },
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a batch job',
				description: 'Read a job and how far its current run has got',
				routing: {
					request: {
						method: 'GET',
						baseURL,
						url: '=/jobs/{{ $parameter.jobId }}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many batch jobs',
				description: 'List the jobs on this account',
				routing: {
					request: {
						method: 'GET',
						baseURL,
						url: '/jobs',
					},
					operations: cursorPagination,
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'jobs' } }],
					},
				},
			},
			{
				name: 'Get Results',
				value: 'getResults',
				action: 'Get the results of a batch job',
				description: 'List a run\'s tasks with a download link for each one',
				routing: {
					request: {
						method: 'GET',
						baseURL,
						url: '=/jobs/{{ $parameter.jobId }}/results',
					},
					operations: cursorPagination,
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'results' } }],
					},
				},
			},
		],
		default: 'create',
	},
	jobIdField(['delete', 'get', 'getResults']),
	...batchJobCreateDescription,
	...batchJobGetManyDescription,
	...batchJobGetResultsDescription,
];
