import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { SearchJobDoc } from '../interfaces/search-job-doc.interface';

export const dtoToSearchConverter = (doc: JobDto): SearchJobDoc => {
  return {
    id: doc.id,
    owner_id: doc.ownerId,
    title: doc.title,
    description: doc.description,
    salary: doc.salary,
    employment_type: doc.employmentType,
    searchable_since: doc.searchableSince,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  };
};
