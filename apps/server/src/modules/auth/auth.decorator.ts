import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtGuard } from '@/modules/common/guards/jwt.guard';
import { RolesGuard } from '@/modules/common/guards/roles.guard';

export const ROLES_KEY = 'roles';

export function Auth(...roles: Array<string>) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
