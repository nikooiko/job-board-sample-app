import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import authConfig from '../config/auth.config';
import { AccessTokenDataDto } from '../dto/access-token-data.dto';
import { AUTH_COOKIE_NAME } from '../constants/auth-cookie-name.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    public readonly config: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: (req: Request) => this.extractJwtFromCookie(req),
      ignoreExpiration: false,
      secretOrKey: config.accessToken.secret,
    });
  }

  async validate(payload: AccessTokenDataDto) {
    return payload;
  }

  extractJwtFromCookie(req: Request) {
    return req.cookies[AUTH_COOKIE_NAME];
  }
}
