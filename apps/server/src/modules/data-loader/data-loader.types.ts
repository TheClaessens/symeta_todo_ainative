import type { DataLoaderService } from '@/modules/data-loader/data-loader.service';

export interface DataLoaderOptions {
  maxBatchSize?: number;
  cache?: boolean;
  debug?: boolean;
}

export const DATALOADER_OPTIONS = 'DATALOADER_OPTIONS';

export type DataLoaders = ReturnType<DataLoaderService['createLoaders']>;
