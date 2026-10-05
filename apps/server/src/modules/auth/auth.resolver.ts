import { Injectable, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { Profile } from '@/modules/auth/models/auth.models';
import { type IUser, User } from '@/modules/common/decorators/user.decorator';
import { JwtGuard } from '@/modules/common/guards/jwt.guard';

@Injectable()
@Resolver(() => Profile)
export class AuthResolver {
  @Query(() => Profile)
  @UseGuards(JwtGuard)
  async profile(@User() user: IUser) {
    return user;
  }
}
