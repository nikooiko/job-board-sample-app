import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { SearchJobDoc } from '../interfaces/search-job-doc.interface';
import { jobsIndex } from '../indices/jobs.index';

export const searchToDtoConverter = (doc: SearchJobDoc): JobDto => {
  const { employment_type, searchable_since, ...rest } = doc;
  return {
    ...rest,
    employmentType: employment_type,
    searchableSince: searchable_since,
    searchIndex: jobsIndex.index,
  };
};
