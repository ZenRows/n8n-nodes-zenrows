import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from '../../shared/pagination';

export const batchJobGetManyDescription: INodeProperties[] = [...paginationFields('batchJob', 'getAll')];
