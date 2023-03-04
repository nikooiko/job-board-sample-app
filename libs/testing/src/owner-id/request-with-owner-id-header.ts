import supertest from 'supertest';
import { APP_OWNER_ID_HEADER } from '@app/extra/ownership/constants/app-owner-id-header.constant';

/**
 * This utility is used with supertest-requests to directly set an owner id as a header.
 * @param {supertest.SuperTest<supertest.Test>} req
 * @param {string} id
 */
export function requestWithOwnerIdHeader(
  req: supertest.Test,
  id: string,
): supertest.Test {
  return req.set(APP_OWNER_ID_HEADER, id);
}
