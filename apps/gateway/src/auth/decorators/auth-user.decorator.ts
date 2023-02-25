import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenDataDto } from '../dto/access-token-data.dto';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessTokenDataDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
