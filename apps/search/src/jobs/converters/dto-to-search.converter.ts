import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { SearchJobDoc } from '../interfaces/search-job-doc.interface';

export const dtoToSearchConverter = (doc: JobDto): SearchJobDoc => {
  const { employmentType, ...rest } = doc;
  return {
    ...rest,
    employment_type: employmentType,
  };
};
