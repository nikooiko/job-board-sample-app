import { registerAs } from '@nestjs/config';

export const JOBS_CONFIG_KEY = 'jobs';

export default registerAs(JOBS_CONFIG_KEY, () => ({
  rootUrl:
    process.env.JOBS_SVC_ROOT_URL ||
    'http://localhost:4000/private/api/v1/jobs-svc',
}));
