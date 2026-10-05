import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiOffsetPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'pageIndex',
      required: false,
      type: Number,
      description: 'Page number (zero-based)',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      description: 'Number of records per page',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Sort order of results',
    }),
    ApiQuery({
      name: 'orderBy',
      required: false,
      type: String,
      description: 'Field to order results by',
    })
  );
}
