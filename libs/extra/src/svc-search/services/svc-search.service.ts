import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import svcSearchConfig from '../config/svc-search.config';
import { ConfigType } from '@nestjs/config';
import { wrapSvcRequest } from '@app/core/api/utils/wrap-svc-request.util';
import { SearchJobsQueryDto } from '@app/extra/svc-search/dto/search-jobs-query.dto';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { SearchJobsListDto } from '@app/extra/svc-search/dto/search-jobs-list.dto';

@Injectable()
export class SvcSearchService {
  public jobsUrl: string;

  constructor(
    @Inject(svcSearchConfig.KEY)
    private readonly config: ConfigType<typeof svcSearchConfig>,
    private readonly httpService: HttpService,
  ) {
    this.jobsUrl = `${config.rootUrl}/private/api/v1/search-svc/jobs`;
  }

  async indexName() {
    return wrapSvcRequest<string>(
      this.httpService.get(`${this.jobsUrl}/index`),
    );
  }

  async searchJobs(params: SearchJobsQueryDto) {
    return wrapSvcRequest<SearchJobsListDto>(
      this.httpService.get(this.jobsUrl, { params }),
    );
  }

  async upsertJob(job: JobDto) {
    return wrapSvcRequest<{ searchableSince: Date; searchIndex: string }>(
      this.httpService.post(this.jobsUrl, job),
    );
  }

  async removeJob(id: number) {
    return wrapSvcRequest<void>(
      this.httpService.delete(`${this.jobsUrl}/${id}`),
    );
  }
}
