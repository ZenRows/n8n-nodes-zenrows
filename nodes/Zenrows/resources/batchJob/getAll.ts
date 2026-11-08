import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from '../../shared/pagination';

// GET /jobs takes limit up to 100; left alone it answers with 50.
export const batchJobGetManyDescription: INodeProperties[] = [
	...paginationFields('batchJob', 'getAll', 100),
];
