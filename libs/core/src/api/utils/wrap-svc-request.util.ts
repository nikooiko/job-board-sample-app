import { lastValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

/**
 * Wraps a service request to properly handle responses and errors. This is a custom solution that favors
 * Observables flow instead of axios-related management (e.g. interceptors).
 * @param {Observable<AxiosResponse<any>>} req
 * @returns {Promise<any>}
 */
export const wrapSvcRequest = async <T>(
  req: Observable<AxiosResponse<T>>,
): Promise<T> => {
  const { data } = await lastValueFrom(req);
  return data;
};
