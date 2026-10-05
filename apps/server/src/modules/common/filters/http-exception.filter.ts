import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlContextType } from '@nestjs/graphql';
import { ZodError } from 'zod';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const cause = exception.cause;
    if (cause instanceof ZodError) {
      this.logger.error(`Zod exception: ${cause.message}`);
    } else if (
      exception.message.startsWith('Serialization failed:') ||
      exception.message.includes('Zod')
    ) {
      this.logger.error(`Schema exception: ${exception.message}`);
    }

    if (host.getType<GqlContextType>() !== 'http') {
      throw exception;
    }

    super.catch(exception, host);
  }
}
