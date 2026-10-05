import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type LoginPayload } from '@repo/shared';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { env } from '@/env';
import type { IUser } from '@/modules/common/decorators/user.decorator';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: LoginPayload): Promise<IUser | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const { password: _, ...props } = user;

    return props;
  }
}
