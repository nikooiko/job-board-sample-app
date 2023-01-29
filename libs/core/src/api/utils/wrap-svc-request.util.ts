import { catchError, lastValueFrom, Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpException } from '@nestjs/common';
import { AppInternalServerErrorException } from '../../error-handling/exceptions/app-internal-server-error.exception';

/**
 * Wraps a service request to properly handle responses and errors. This is a custom solution that favors
 * Observables flow instead of axios-related management (e.g. interceptors).
 * @param {Observable<AxiosResponse<any>>} req
 * @returns {Promise<any>}
 */
export const wrapSvcRequest = async <T>(
  req: Observable<AxiosResponse<T>>,
): Promise<T> => {
  const { data } = await lastValueFrom(
    req.pipe(
      catchError(
        (
          error: AxiosError<{
            statusCode: number;
            message: string;
            error: string;
          }>,
        ) => {
          const httpError = error?.response?.data;
          throw httpError?.statusCode
            ? new HttpException(httpError, httpError.statusCode)
            : new AppInternalServerErrorException();
        },
      ),
    ),
  );
  return data;
};
