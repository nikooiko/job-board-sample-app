import { registerAs } from '@nestjs/config';

export const SVC_USERS_CONFIG_KEY = 'svc-users';

export default registerAs(SVC_USERS_CONFIG_KEY, () => ({
  rootUrl: process.env.USERS_SVC_ROOT_URL || 'http://localhost:4002',
}));
