import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiCursorPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'cursor',
      required: false,
      type: String,
      description: 'The ID to start pagination from',
    }),
    ApiQuery({
      name: 'take',
      required: false,
      type: Number,
      description: 'Number of records to fetch',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Sort order of results',
    })
  );
}
