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

  async create(data: Prisma.JobCreateInput): Promise<JobDto> {
    const job = await this.prisma.job.create({
      data,
    });
    this.logger.info('Created job', { type: 'JOB_CREATED', id: job.id, data });
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

  async update({
    where,
    data,
  }: {
    where: Prisma.JobWhereUniqueInput;
    data: Prisma.JobUpdateInput;
  }): Promise<JobDto> {
    const job = await this.prisma.job.update({
      data,
      where,
    });
    this.logger.info('Updated job', { type: 'JOB_UPDATED', where, data });
    return job;
  }

  async remove(where: Prisma.JobWhereUniqueInput): Promise<JobDto> {
    const job = await this.prisma.job.delete({
      where,
    });
    this.logger.info('Deleted job', { type: 'JOB_DELETED', where });
    return job;
  }
}
