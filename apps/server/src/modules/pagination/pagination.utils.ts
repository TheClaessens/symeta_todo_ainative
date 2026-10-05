import { z } from 'zod';

const orderLiteral = z.enum(['asc', 'desc']);

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  take: z.preprocess((val) => {
    if (typeof val === 'string') {
      return parseInt(val, 10);
    }
    return val;
  }, z.number().min(1).default(10)),
  order: orderLiteral.optional().default('asc'),
});

export type CursorPagination = z.infer<typeof cursorPaginationSchema>;

export const cursorPaginatedResultSchema = (schema: z.ZodSchema) =>
  z.object({
    data: z.array(schema),
    total: z.number(),
    nextCursor: z.string().optional(),
  });

// Offset Pagination
export const offsetPaginationSchema = z.object({
  pageIndex: z.preprocess((val) => {
    if (typeof val === 'string') {
      return parseInt(val, 10);
    }
    return val;
  }, z.number().min(0).default(0)),
  pageSize: z.preprocess((val) => {
    if (typeof val === 'string') {
      return parseInt(val, 10);
    }
    return val;
  }, z.number().min(1).default(10)),
  order: orderLiteral.optional().default('asc'),
  orderBy: z.string().optional(),
});

export type OffsetPagination = z.infer<typeof offsetPaginationSchema>;

export const offsetPaginatedResultSchema = (schema: z.ZodSchema) =>
  z.object({
    data: z.array(schema),
    total: z.number(),
    pageIndex: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  });

export interface OffsetPaginationResult<T> {
  data: Array<T>;
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export class Pagination {
  static createOffsetPagination<T>(
    data: Array<T>,
    total: number,
    pageIndex: number,
    pageSize: number
  ): z.infer<
    ReturnType<typeof offsetPaginatedResultSchema> & { data: Array<T> }
  > {
    const result = {
      data,
      total,
      pageIndex,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
    z.object({
      data: z.array(z.custom<T>()),
      total: z.number(),
      pageIndex: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
    }).parse(result);
    return result;
  }

  static createCursorPaginatedResult<T>(
    data: Array<T>,
    total: number,
    nextCursor?: string
  ): z.infer<
    ReturnType<typeof cursorPaginatedResultSchema> & { data: Array<T> }
  > {
    const result = {
      data,
      total,
      nextCursor,
    };
    z.object({
      data: z.array(z.custom<T>()),
      total: z.number(),
      nextCursor: z.string().optional(),
    }).parse(result);
    return result;
  }
}
