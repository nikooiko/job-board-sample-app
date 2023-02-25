import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import authConfig from '../config/auth.config';
import { AccessTokenDataDto } from '../dto/access-token-data.dto';
import { Response } from 'express';
import { AUTH_COOKIE_NAME } from '../constants/auth-cookie-name.constant';
import { SvcUsersService } from '@app/extra/svc-users/services/svc-users.service';
import { CreateUserDto } from '@app/extra/svc-users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    public readonly config: ConfigType<typeof authConfig>,
    private svcUsersService: SvcUsersService,
    private jwtService: JwtService,
  ) {}

  async register(payload: CreateUserDto): Promise<{ accessToken: string }> {
    const user = await this.svcUsersService.create(payload);
    return {
      accessToken: this.jwtService.sign({
        id: user.id,
      }),
    };
  }

  async login(payload: AccessTokenDataDto): Promise<{ accessToken: string }> {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  setCookie(res: Response, accessToken: string) {
    res.cookie(AUTH_COOKIE_NAME, accessToken, this.config.accessToken.options);
  }
}
