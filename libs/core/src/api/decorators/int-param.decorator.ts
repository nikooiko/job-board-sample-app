import { Param, ParseIntPipe } from '@nestjs/common';
import { AppBadRequestException } from '../../error-handling/exceptions/app-bad-request.exception';

export function IntParam(prop = 'id'): ParameterDecorator {
  return Param(
    prop,
    new ParseIntPipe({
      exceptionFactory: () =>
        new AppBadRequestException(`Param '${prop}' must be an integer`),
    }),
  );
}
