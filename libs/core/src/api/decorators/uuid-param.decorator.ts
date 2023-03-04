import { Param, ParseUUIDPipe } from '@nestjs/common';
import { AppBadRequestException } from '../../error-handling/exceptions/app-bad-request.exception';

export function UUIDParam(prop = 'id'): ParameterDecorator {
  return Param(
    prop,
    new ParseUUIDPipe({
      exceptionFactory: () =>
        new AppBadRequestException(`Param '${prop}' must be a UUID`),
    }),
  );
}
