import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { handleContextUser } from '@/modules/auth/context';

export interface IUser {
  id: string;
  email: string;
  role: string;
}

export const User = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) =>
    handleContextUser(data, context)
);
