import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';

export const jobsIndex: IndicesCreateRequest = {
  index: 'jobs',
  mappings: {
    properties: {
      owner_id: { type: 'keyword' },
      title: { type: 'text', analyzer: 'english' },
      description: { type: 'text', analyzer: 'english' },
      salary: { type: 'integer' },
      employment_type: { type: 'keyword' },
      searchable_since: { type: 'date' },
      created_at: { type: 'date' },
      updated_at: { type: 'date' },
    },
  },
};
