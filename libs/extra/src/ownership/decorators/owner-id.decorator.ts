import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const OwnerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.ownerId;
  },
);
