import { ArgumentsHost, HttpException, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger } from 'winston';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { AppInternalServerErrorException } from '@app/core/error-handling/exceptions/app-internal-server-error.exception';
import { AppNotFoundException } from '@app/core/error-handling/exceptions/app-not-found.exception';
import { AppBadRequestException } from '@app/core/error-handling/exceptions/app-bad-request.exception';

/**
 * A generic prisma-based exceptions filter that translates known prisma exceptions into
 * application-specific HttpException exceptions. If the exception is not recognized, it
 * is treated as an internal server error. This filter must be extended with an appropriate
 * @Catch() to handle prisma errors only.
 * (e.g. @Catch(Prisma.PrismaClientKnownRequestError, Prisma.NotFoundError).
 */
export class PrismaExceptionsFilter extends BaseExceptionFilter {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    super.catch(this.exceptionToHttp(exception), host);
  }

  /**
   * Converts provided prisma exception to HttpException.
   * (based on https://www.prisma.io/docs/reference/api-reference/error-reference)
   * @param {any} exception
   * @returns {HttpException}
   */
  exceptionToHttp(exception: any): HttpException {
    switch (exception.code) {
      case 'P2002':
        return new AppBadRequestException('Already exists', 'already_exists');
      case 'P2025':
        return new AppNotFoundException();
    }
    this.logger.error('Unexpected prisma error', {
      type: 'UNEXPECTED_PRISMA_ERROR',
      error: exception,
      code: exception.code,
      meta: exception.meta,
      clientVersion: exception.clientVersion,
    });
    return new AppInternalServerErrorException();
  }
}
