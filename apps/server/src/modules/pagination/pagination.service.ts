import { Injectable } from '@nestjs/common';
import type { Prisma } from '@repo/database';

import {
  type CursorPagination,
  cursorPaginationSchema,
  type OffsetPagination,
  offsetPaginationSchema,
  Pagination,
} from '@/modules/pagination/pagination.utils';

type FindManyArgs<T extends Prisma.ModelName> =
  Prisma.TypeMap['model'][T]['operations']['findMany']['args'];

type CountArgs<T extends Prisma.ModelName> =
  Prisma.TypeMap['model'][T]['operations']['count']['args'];

interface CursorPaginationParams<
  T extends Record<string, unknown>,
  M extends Prisma.ModelName,
> {
  model: {
    findMany: (args: FindManyArgs<M>) => Promise<Array<T>>;
    count: (args: CountArgs<M>) => Promise<number>;
  };
  pagination: CursorPagination;
  cursorKey?: keyof T;
  where?: FindManyArgs<M>['where'];
  orderBy?: keyof T;
}

interface OffsetPaginationParams<
  T extends Record<string, unknown>,
  M extends Prisma.ModelName,
> {
  model: {
    findMany: (args: FindManyArgs<M>) => Promise<Array<T>>;
    count: (args: CountArgs<M>) => Promise<number>;
  };
  pagination: OffsetPagination;
  where?: FindManyArgs<M>['where'];
  select?: FindManyArgs<M>['select'];
  orderBy?: keyof T;
}

@Injectable()
export class PaginationService {
  async cursorPaginate<
    T extends Record<string, unknown>,
    M extends Prisma.ModelName,
  >({
    model,
    cursorKey = 'id',
    where,
    orderBy: _orderBy = 'createdAt',
    pagination: _pagination,
  }: CursorPaginationParams<T, M>) {
    const pagination = cursorPaginationSchema.parse(_pagination);

    const orderBy = {
      [_orderBy]: pagination.order,
    } as const;

    const cursor = pagination.cursor
      ? ({
          [cursorKey]: pagination.cursor,
        } as const)
      : undefined;

    const findArgs = {
      take: pagination.take + 1,
      orderBy,
      where,
      cursor,
      skip: pagination.cursor ? 1 : undefined,
    };
    const [results, total] = await Promise.all([
      model.findMany(findArgs as FindManyArgs<M>),
      model.count({ where } as CountArgs<M>),
    ]);

    const hasNext = results.length > pagination.take;
    const data = results.slice(0, pagination.take);

    const lastItem = data[data.length - 1];
    const nextCursor = hasNext && lastItem ? lastItem[cursorKey] : undefined;
    return Pagination.createCursorPaginatedResult<T>(
      data,
      total,
      nextCursor as string
    );
  }

  async offsetPaginate<
    T extends Record<string, unknown>,
    M extends Prisma.ModelName,
  >({
    model,
    where,
    orderBy: _orderBy = 'createdAt',
    pagination: _pagination,
    select,
  }: OffsetPaginationParams<T, M>) {
    const pagination = offsetPaginationSchema.parse(_pagination);
    const orderBy = {
      [_orderBy]: pagination.order,
    } as const;

    const findArgs = {
      take: pagination.pageSize,
      skip: pagination.pageIndex * pagination.pageSize,
      orderBy,
      where,
      select,
    };

    const [results, total] = await Promise.all([
      model.findMany(findArgs as FindManyArgs<M>),
      model.count({ where } as CountArgs<M>),
    ]);

    return Pagination.createOffsetPagination<T>(
      results,
      total,
      pagination.pageIndex,
      pagination.pageSize
    );
  }
}
