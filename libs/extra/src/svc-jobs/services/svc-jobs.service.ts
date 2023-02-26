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
import { APP_OWNER_ID_HEADER } from '@app/extra/ownership/constants/app-owner-id-header.constant';

@Injectable()
export class SvcJobsService {
  public apiUrl: string;

  constructor(
    @Inject(svcJobsConfig.KEY)
    private readonly config: ConfigType<typeof svcJobsConfig>,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = `${config.rootUrl}/private/api/v1/jobs-svc/jobs`;
  }

  async create(ownerId: string, data: CreateJobDto): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.post<JobDto>(this.apiUrl, data, {
        headers: {
          [APP_OWNER_ID_HEADER]: ownerId,
        },
      }),
    );
  }

  async findAll(
    ownerId: string,
    query: FindAllJobsQueryDto,
  ): Promise<JobsListDto> {
    return wrapSvcRequest<JobsListDto>(
      this.httpService.get<JobsListDto>(this.apiUrl, {
        params: query,
        headers: {
          [APP_OWNER_ID_HEADER]: ownerId,
        },
      }),
    );
  }

  async findOne(ownerId: string, id: number): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.get(`${this.apiUrl}/${id}`, {
        headers: {
          [APP_OWNER_ID_HEADER]: ownerId,
        },
      }),
    );
  }

  async update(
    ownerId: string,
    id: number,
    data: PatchJobDto,
  ): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.patch(`${this.apiUrl}/${id}`, data, {
        headers: {
          [APP_OWNER_ID_HEADER]: ownerId,
        },
      }),
    );
  }

  async remove(ownerId: string, id: number): Promise<JobDto> {
    return wrapSvcRequest<JobDto>(
      this.httpService.delete(`${this.apiUrl}/${id}`, {
        headers: {
          [APP_OWNER_ID_HEADER]: ownerId,
        },
      }),
    );
  }
}
