import { registerAs } from '@nestjs/config';

export const SVC_SEARCH_CONFIG_KEY = 'svc-search';

export default registerAs(SVC_SEARCH_CONFIG_KEY, () => ({
  rootUrl: process.env.SEARCH_SVC_ROOT_URL || 'http://localhost:4001',
}));
