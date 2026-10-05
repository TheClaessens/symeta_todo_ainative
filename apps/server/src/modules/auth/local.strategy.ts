import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import type { IUser } from '@/modules/common/decorators/user.decorator';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { verify } from '@/utils/hash';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async validate(username: string, password: string): Promise<IUser | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: username,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await verify(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...props } = user;

    return props;
  }
}
