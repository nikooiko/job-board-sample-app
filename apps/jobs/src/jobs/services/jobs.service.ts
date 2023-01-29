import { Inject, Injectable } from '@nestjs/common';
import { JobDto } from '@app/extra/jobs/dto/job.dto';
import { Prisma } from '@app/jobs/prisma-client';
import { JobsPrismaService } from '../../jobs-prisma/services/jobs-prisma.service';
import { ListJobDto } from '@app/extra/jobs/dto/list-job.dto';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';

@Injectable()
export class JobsService {
  constructor(
    private prisma: JobsPrismaService,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async create(data: Prisma.JobPostCreateInput): Promise<JobDto> {
    const job = await this.prisma.jobPost.create({
      data,
    });
    this.logger.info('Created job', { type: 'JOB_CREATED', id: job.id, data });
    return job;
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.JobPostWhereUniqueInput;
      where?: Prisma.JobPostWhereInput;
      orderBy?: Prisma.JobPostOrderByWithRelationInput;
    } = {},
  ): Promise<ListJobDto> {
    const { skip, take = 10, cursor, where, orderBy } = params;
    const [items, count] = await this.prisma.$transaction([
      this.prisma.jobPost.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.jobPost.count({ where }),
    ]);
    return {
      items,
      limit: take,
      count,
      pages: Math.ceil(count / take),
    };
  }

  async findOne(where: Prisma.JobPostWhereUniqueInput): Promise<JobDto> {
    return this.prisma.jobPost.findUniqueOrThrow({
      where,
    });
  }

  async update({
    where,
    data,
  }: {
    where: Prisma.JobPostWhereUniqueInput;
    data: Prisma.JobPostUpdateInput;
  }): Promise<JobDto> {
    const job = await this.prisma.jobPost.update({
      data,
      where,
    });
    this.logger.info('Updated job', { type: 'JOB_UPDATED', where, data });
    return job;
  }

  async remove(where: Prisma.JobPostWhereUniqueInput): Promise<JobDto> {
    const job = await this.prisma.jobPost.delete({
      where,
    });
    this.logger.info('Deleted job', { type: 'JOB_DELETED', where });
    return job;
  }
}
