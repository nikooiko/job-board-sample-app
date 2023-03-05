import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { SearchJobDoc } from '../interfaces/search-job-doc.interface';
import { jobsIndex } from '../indices/jobs.index';

export const searchToDtoConverter = (doc: SearchJobDoc): JobDto => {
  return {
    id: doc.id,
    ownerId: doc.owner_id,
    title: doc.title,
    description: doc.description,
    salary: doc.salary,
    employmentType: doc.employment_type,
    searchableSince: doc.searchable_since,
    searchIndex: jobsIndex.index,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  };
};
