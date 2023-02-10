import { registerAs } from '@nestjs/config';
import { ClientOptions } from '@elastic/elasticsearch';

export const ELASTICSEARCH_CONFIG_KEY = 'elasticsearch';

export default registerAs(
  ELASTICSEARCH_CONFIG_KEY,
  (): ClientOptions => ({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
      password: process.env.ELASTICSEARCH_PASSWORD || 'elastic',
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  }),
);
