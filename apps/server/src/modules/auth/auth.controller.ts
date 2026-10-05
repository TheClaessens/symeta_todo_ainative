import {
  Body,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { Auth } from '@/modules/auth/auth.decorator';
import { AuthService } from '@/modules/auth/auth.service';
import {
  type LoginRequest,
  loginRequestSchema,
  loginResponseSchema,
  profileResponseSchema,
} from '@/modules/auth/models/login.dto';
import { type IUser, User } from '@/modules/common/decorators/user.decorator';
import { LocalGuard } from '@/modules/common/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({
    operationId: 'login',
    summary: 'Login',
  })
  @ApiOkResponse({ standardSchema: loginResponseSchema })
  @SerializeOptions({ schema: loginResponseSchema })
  async login(
    @Body({ schema: loginRequestSchema }) _body: LoginRequest,
    @User() user: IUser
  ) {
    return this.authService.login(user);
  }

  @Get('profile')
  @Auth()
  @ApiOperation({
    operationId: 'getProfile',
    summary: 'Get profile',
  })
  @ApiOkResponse({ standardSchema: profileResponseSchema })
  @SerializeOptions({ schema: profileResponseSchema })
  async profile(@User() user: IUser) {
    return user;
  }
}
