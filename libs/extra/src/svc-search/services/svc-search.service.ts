import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ListJobDto } from '@app/extra/svc-jobs/dto/list-job.dto';
import svcSearchConfig from '../config/svc-search.config';
import { ConfigType } from '@nestjs/config';
import { wrapSvcRequest } from '@app/core/api/utils/wrap-svc-request.util';
import { SearchJobsQueryDto } from '@app/extra/svc-search/dto/search-jobs-query.dto';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';

@Injectable()
export class SvcSearchService {
  public jobsUrl: string;

  constructor(
    @Inject(svcSearchConfig.KEY)
    private readonly config: ConfigType<typeof svcSearchConfig>,
    private readonly httpService: HttpService,
  ) {
    this.jobsUrl = `${config.rootUrl}/jobs`;
  }

  async searchJobs(params: SearchJobsQueryDto): Promise<ListJobDto> {
    return wrapSvcRequest<ListJobDto>(
      this.httpService.get(this.jobsUrl, { params }),
    );
  }

  async upsertJob(job: JobDto): Promise<string> {
    return wrapSvcRequest<string>(this.httpService.post(this.jobsUrl, job));
  }

  async removeJob(id: number): Promise<void> {
    return wrapSvcRequest<void>(
      this.httpService.delete(`${this.jobsUrl}/${id}`),
    );
  }
}
