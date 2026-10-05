import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from '@repo/shared';

import type { IUser } from '@/modules/common/decorators/user.decorator';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: IUser) {
    const payload: LoginPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.email,
    };
  }
}
