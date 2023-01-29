import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateJobDto } from '@app/extra/jobs/dto/create-job.dto';
import { JobDto } from '@app/extra/jobs/dto/job.dto';
import { ListJobDto } from '@app/extra/jobs/dto/list-job.dto';
import { PatchJobDto } from '@app/extra/jobs/dto/patch-job.dto';
import jobsConfig from '../config/jobs.config';
import { ConfigType } from '@nestjs/config';
import { wrapSvcRequest } from '@app/core/api/utils/wrap-svc-request.util';
import { FindAllJobsQueryDto } from '@app/extra/jobs/dto/find-all-jobs-query.dto';

@Injectable()
export class JobsService {
  public apiUrl: string;

  constructor(
    @Inject(jobsConfig.KEY)
    private readonly config: ConfigType<typeof jobsConfig>,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = `${config.rootUrl}/private/api/v1/jobs`;
  }

  async create(data: CreateJobDto): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.post<JobDto>(this.apiUrl, data),
    );
  }

  async findAll(query: FindAllJobsQueryDto): Promise<ListJobDto> {
    return wrapSvcRequest<ListJobDto>(
      this.httpService.get<ListJobDto>(this.apiUrl, { params: query }),
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
