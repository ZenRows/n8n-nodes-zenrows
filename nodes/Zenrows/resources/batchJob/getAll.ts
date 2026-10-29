import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from './pagination';

export const batchJobGetManyDescription: INodeProperties[] = [...paginationFields('getAll')];
