import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';

export const jobsIndex: IndicesCreateRequest = {
  index: 'jobs',
  mappings: {
    properties: {
      title: { type: 'text' },
      description: { type: 'text' },
      salary: { type: 'integer' },
      employment_type: { type: 'constant_keyword' },
    },
  },
};
