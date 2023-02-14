import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateJobDto } from '@app/extra/svc-jobs/dto/create-job.dto';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { JobsListDto } from '@app/extra/svc-jobs/dto/jobs-list.dto';
import { PatchJobDto } from '@app/extra/svc-jobs/dto/patch-job.dto';
import { ConfigType } from '@nestjs/config';
import { wrapSvcRequest } from '@app/core/api/utils/wrap-svc-request.util';
import { FindAllJobsQueryDto } from '@app/extra/svc-jobs/dto/find-all-jobs-query.dto';
import svcJobsConfig from '../config/svc-jobs.config';

@Injectable()
export class SvcJobsService {
  public apiUrl: string;

  constructor(
    @Inject(svcJobsConfig.KEY)
    private readonly config: ConfigType<typeof svcJobsConfig>,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = `${config.rootUrl}/jobs`;
  }

  async create(data: CreateJobDto): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.post<JobDto>(this.apiUrl, data),
    );
  }

  async findAll(query: FindAllJobsQueryDto): Promise<JobsListDto> {
    return wrapSvcRequest<JobsListDto>(
      this.httpService.get<JobsListDto>(this.apiUrl, { params: query }),
    );
  }

  async findOne(id: number): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(this.httpService.get(`${this.apiUrl}/${id}`));
  }

  async update(id: number, data: PatchJobDto): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.patch(`${this.apiUrl}/${id}`, data),
    );
  }

  async remove(id: number): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.delete(`${this.apiUrl}/${id}`),
    );
  }
}
