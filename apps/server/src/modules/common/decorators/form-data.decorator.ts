import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { ZodSchema } from 'zod';

interface FormDataOptions {
  key?: string;
  schema?: ZodSchema;
}

/**
 * Decorator to parse form data from the request body.
 * Handy when using file upload with multer and JSON body.
 */
export const FormData = createParamDecorator(
  (options: FormDataOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const key = options?.key ?? 'data';
    const data = request.body?.[key];

    if (options?.schema) {
      return options.schema.parse(JSON.parse(data));
    }

    return data;
  }
);
