import { Inject, Injectable } from '@nestjs/common';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { Prisma } from '@app/jobs/prisma-client';
import { JobsPrismaService } from '../../jobs-prisma/services/jobs-prisma.service';
import { ListJobDto } from '@app/extra/svc-jobs/dto/list-job.dto';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';

@Injectable()
export class JobsService {
  constructor(
    private prisma: JobsPrismaService,
    @Inject(LOGGER) private logger: Logger,
    private svcSearchService: SvcSearchService,
  ) {}

  async create(data: Prisma.JobCreateInput): Promise<JobDto> {
    const job = await this.prisma.job.create({
      data,
    });
    this.logger.info('Created job', { type: 'JOB_CREATED', id: job.id, data });
    await this.tryUploadToSearch(job.id, job); // always resolves
    return job;
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.JobWhereUniqueInput;
      where?: Prisma.JobWhereInput;
      orderBy?: Prisma.JobOrderByWithRelationInput;
    } = {},
  ): Promise<ListJobDto> {
    const { skip, take = 10, cursor, where, orderBy } = params;
    const [items, count] = await Promise.all([
      this.prisma.job.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.job.count({ where }),
    ]);
    return {
      items,
      limit: take,
      count,
      pages: Math.ceil(count / take),
    };
  }

  async findOne(where: Prisma.JobWhereUniqueInput): Promise<JobDto> {
    return this.prisma.job.findUniqueOrThrow({
      where,
    });
  }

  async update(
    {
      where,
      data,
    }: {
      where: Prisma.JobWhereUniqueInput;
      data: Prisma.JobUpdateInput;
    },
    updateSearch = true,
  ): Promise<JobDto> {
    const job = await this.prisma.job.update({
      data,
      where,
    });
    this.logger.info('Updated job', { type: 'JOB_UPDATED', where, data });
    if (updateSearch) {
      await this.tryUploadToSearch(job.id, job); // always resolves
    }
    return job;
  }

  async remove(where: Prisma.JobWhereUniqueInput): Promise<JobDto> {
    const job = await this.prisma.job.delete({
      where,
    });
    await this.tryRemoveFromSearch(job.id); // always resolves
    this.logger.info('Deleted job', { type: 'JOB_DELETED', where });
    return job;
  }

  /**
   * Tries to add a job to the search index.
   * @param {number} id
   * @param {JobDto} [job]
   */
  async tryUploadToSearch(id: number, job?: JobDto): Promise<void> {
    let data = job;
    try {
      if (!data) {
        data = await this.findOne({ id: id });
      }
      const searchIndex = await this.svcSearchService.upsertJob(data);
      await this.update(
        {
          where: { id: data.id },
          data: {
            searchIndex,
            searchableSince: new Date(),
          },
        },
        false,
      );
      this.logger.info('Added job to search index', {
        type: 'SEARCH_UPLOAD_JOB_SUCCESS',
        id,
        data,
      });
    } catch (err) {
      const errorResponse = err?.getResponse();
      this.logger.error('Failed to index job', {
        type: 'SEARCH_UPLOAD_JOB_FAILED',
        err,
        errorResponse,
        id,
        data,
      });
    }
  }

  /**
   * Tries to remove a job from the search index. Returns true if operation failed and need to retry it later on.
   * @param {boolean} id
   * @returns {Promise<boolean>}
   */
  async tryRemoveFromSearch(id: number): Promise<boolean> {
    try {
      await this.svcSearchService.removeJob(id);
      this.logger.info('Removed job from search index', {
        type: 'SEARCH_REMOVE_JOB_SUCCESS',
        id,
      });
      return false;
    } catch (err) {
      const errorResponse = err?.getResponse();
      if (errorResponse?.status === 404) {
        this.logger.error('Failed to index job', {
          type: 'SEARCH_REMOVE_JOB_NOT_FOUND',
          err,
          errorResponse,
          id,
        });
        // when job is not found, we don't need to retry the operation
        return false;
      }
      this.logger.error('Failed to index job', {
        type: 'SEARCH_REMOVE_JOB_FAILED',
        err,
        errorResponse,
        id,
      });
    }
    return true;
  }
}
