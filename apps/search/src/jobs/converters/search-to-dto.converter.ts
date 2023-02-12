import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { SearchJobDoc } from '../interfaces/search-job-doc.interface';

export const searchToDtoConverter = (doc: SearchJobDoc): JobDto => {
  const { employment_type, ...rest } = doc;
  return {
    ...rest,
    employmentType: employment_type,
  };
};
