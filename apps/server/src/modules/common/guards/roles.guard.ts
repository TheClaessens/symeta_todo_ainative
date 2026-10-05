import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/modules/auth/auth.decorator';
import type { IUser } from '@/modules/common/decorators/user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Array<string>>(
      ROLES_KEY,
      context.getHandler()
    );
    if (roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser | undefined;
    if (!user) {
      return false;
    }

    return roles.some((role) => role === user.role);
  }
}
