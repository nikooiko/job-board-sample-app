import { registerAs } from '@nestjs/config';

export const SVC_JOBS_CONFIG_KEY = 'svc-jobs';

export default registerAs(SVC_JOBS_CONFIG_KEY, () => ({
  rootUrl: process.env.JOBS_SVC_ROOT_URL || 'http://localhost:4000',
}));
