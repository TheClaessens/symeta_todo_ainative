import { Inject, Injectable } from '@nestjs/common';
import type { Prisma, PrismaClient } from '@repo/database';
import { groupBy, keyBy, uniq } from '@repo/shared';
import DataLoader from 'dataloader';

import {
  DATALOADER_OPTIONS,
  type DataLoaderOptions,
} from '@/modules/data-loader/data-loader.types';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class DataLoaderService {
  constructor(
    @Inject(DATALOADER_OPTIONS)
    private readonly options: DataLoaderOptions,
    private readonly prisma: PrismaService
  ) {}

  createLoaders() {
    const defaultOptions = {
      cache: this.options.cache ?? true,
      maxBatchSize: this.options.maxBatchSize ?? 100,
    };

    return {
      userById: this.createItemLoader(this.prisma.user, 'id', defaultOptions),
    };
  }

  private createItemLoader = <
    T extends PrismaClient[Uncapitalize<Prisma.ModelName>],
  >(
    model: T,
    field: keyof T['fields'],
    options?: DataLoaderOptions
  ): DataLoader<
    string,
    Awaited<ReturnType<T['findMany']>>[number] | undefined,
    string
  > =>
    new DataLoader(async (ids: ReadonlyArray<string>) => {
      const uniqueIds = uniq(ids);
      const items = await (model as any).findMany({
        where: { [field]: { in: uniqueIds } },
      });

      const itemsByField = keyBy(items, field);
      return uniqueIds.map((id) => itemsByField[id]);
    }, options);

  private createArrayLoader = <
    Model extends PrismaClient[Uncapitalize<Prisma.ModelName>],
  >(
    model: Model,
    field: keyof Model['fields'],
    options?: DataLoaderOptions
  ): DataLoader<
    string,
    Array<Awaited<ReturnType<Model['findMany']>>[number]>,
    string
  > =>
    new DataLoader(async (ids: ReadonlyArray<string>) => {
      const uniqueIds = uniq(ids);
      const items = await (model as any).findMany({
        where: { [field]: { in: uniqueIds } },
      });

      const itemsByField = groupBy(items, (item) => item[field]);
      return uniqueIds.map((id) => itemsByField[id] ?? []);
    }, options);
}
