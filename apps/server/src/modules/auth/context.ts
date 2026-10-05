import type { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

import type { IUser } from '@/modules/common/decorators/user.decorator';

type ExecutionContextWithContextType = ExecutionContext & {
  contextType: 'http' | 'https' | 'graphql';
};

/**
 * Handle context for REST & Graphql
 * Extracts the request object based on correct context so it is compatible with REST & GraphQL
 * @returns Express request or graphql request based on context type
 */
export const handleContext = (context: ExecutionContext) => {
  const contextType = (context as ExecutionContextWithContextType).contextType;
  if (contextType === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  return context.switchToHttp().getRequest<Request>();
};

/**
 * Handles extracting the signed in user of the correct context depending on context type
 * @returns signed in user
 */
export const handleContextUser = (data: unknown, context: ExecutionContext) => {
  const contextType = (context as ExecutionContextWithContextType).contextType;
  if (contextType === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  }
  const request = context.switchToHttp().getRequest<Request>();
  const user = request.user as IUser;
  return data ? user[data as keyof IUser] : user;
};
