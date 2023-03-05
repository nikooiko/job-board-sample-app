import { Inject, Injectable } from '@nestjs/common';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { Prisma } from '@app/jobs/prisma-client';
import { JobsPrismaService } from '../../jobs-prisma/services/jobs-prisma.service';
import { JobsListDto } from '@app/extra/svc-jobs/dto/jobs-list.dto';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { exclude } from '@app/core/prisma/utils/exclude.util';
import { TASKS_QUEUE_REPEATABLE_JOBS } from '../constants/tasks-queue-repeatable-jobs';
import { TASKS_QUEUE } from '../constants/tasks-queue.constant';

@Injectable()
export class JobsService {
  static PARALLEL_UPLOAD_LIMIT = 10; // arbitrary limit
  static PARALLEL_DELETE_LIMIT = 100; // arbitrary limit

  constructor(
    private prisma: JobsPrismaService,
    @Inject(LOGGER) private logger: Logger,
    private svcSearchService: SvcSearchService,
    @InjectQueue(TASKS_QUEUE) private tasksQ: Queue,
  ) {}

  /**
   * Jobs Service initialization procedure adds sync jobs task to the jobs task queue and after a while (next tick)
   * checks for duplicate repeatable task configurations
   */
  async init() {
    // sync jobs with search at next tick for more graceful startup
    setImmediate(async () => {
      await this.setupTasks(); // always resolves
    });
  }

  async create(data: Prisma.JobCreateInput): Promise<JobDto> {
    const job = exclude(
      await this.prisma.job.create({
        data,
      }),
      ['deletedAt'],
    );
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
  ): Promise<JobsListDto> {
    const { skip, take = 10, cursor, where, orderBy } = params;
    const [items, count] = await Promise.all([
      this.prisma.job.findMany({
        skip,
        take,
        cursor,
        where: {
          deletedAt: null, // this is set before where, in case where overrides it (e.g. query on deleted jobs)
          ...where,
        },
        orderBy,
      }),
      this.prisma.job.count({ where }),
    ]);
    return {
      items: items.map((item) => exclude(item, ['deletedAt'])),
      limit: take,
      count,
      pages: Math.ceil(count / take),
    };
  }

  async findOne(where: Prisma.JobWhereUniqueInput): Promise<JobDto> {
    return exclude(
      await this.prisma.job.findUniqueOrThrow({
        where: {
          deletedAt: null, // this is set before where, in case where overrides it (e.g. query on deleted jobs)
          ...where,
        },
      }),
      ['deletedAt'],
    );
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
    const job = exclude(
      await this.prisma.job.update({
        data,
        where: {
          deletedAt: null, // this is set before where, in case where overrides it (e.g. query on deleted jobs)
          ...where,
        },
      }),
      ['deletedAt'],
    );
    this.logger.info('Updated job', { type: 'JOB_UPDATED', where, data });
    if (updateSearch) {
      await this.tryUploadToSearch(job.id, job); // always resolves
    }
    return job;
  }

  async remove(where: Prisma.JobWhereUniqueInput): Promise<JobDto> {
    const job = await this.update(
      {
        where: {
          deletedAt: null, // this is set before where, in case where overrides it (e.g. query on deleted jobs)
          ...where,
        },
        data: { deletedAt: new Date() },
      },
      false,
    );
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
      const { searchIndex, searchableSince } =
        await this.svcSearchService.upsertJob(data);
      await this.update(
        {
          where: { id: data.id },
          data: {
            searchIndex,
            searchableSince,
          },
        },
        false,
      );
      this.logger.info('Added job to search index', {
        type: 'SEARCH_UPLOAD_JOB_SUCCESS',
        searchIndex,
        searchableSince,
        id,
        data,
      });
    } catch (err) {
      const errorResponse = err.isAxiosError && err.response?.data;
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
    } catch (err) {
      const errorResponse = err.isAxiosError && err.response?.data;
      if (errorResponse?.statusCode !== 404) {
        this.logger.error('Failed to remove job from index', {
          type: 'SEARCH_REMOVE_JOB_FAILED',
          err,
          errorResponse,
          id,
        });
        return true;
      }
      this.logger.error('Failed to remove job from index', {
        type: 'SEARCH_REMOVE_JOB_NOT_FOUND',
        err,
        errorResponse,
        id,
      });
    }
    await this.update(
      {
        where: { id, deletedAt: { not: { equals: null } } },
        data: { searchIndex: null, searchableSince: null },
      },
      false,
    );
    // when job is not found, we don't need to retry the operation
    return false;
  }

  /**
   * Uploads jobs that were not previously uploaded to the search index.
   */
  async uploadJobsToIndex(): Promise<void> {
    const take = JobsService.PARALLEL_UPLOAD_LIMIT;
    const fetchedSet = new Set();
    const indexDef = await this.svcSearchService.getIndexDef();
    let attempts = 0;
    let fetched = 0;
    let iterations = 0;
    try {
      while (true) {
        const { items: jobs } = await this.findAll({
          where: {
            OR: [
              {
                searchIndex: {
                  not: {
                    equals: indexDef.index,
                  },
                },
              },
              {
                searchIndex: {
                  equals: null,
                },
              },
            ],
          },
          take,
        });
        jobs.forEach(({ id }: JobDto) => fetchedSet.add(id));
        const newFetched = fetchedSet.size;
        if (newFetched === fetched) {
          // this is a failsafe mechanism, in case something goes wrong with the synchronization, to avoid infinite loops
          break;
        }
        fetched = newFetched;
        iterations++;
        attempts += jobs.length;
        // TODO: create bulk upload method (not one by one as now)
        await Promise.all(
          jobs.map((job) => this.tryUploadToSearch(job.id, job)),
        );
      }
    } catch (err) {
      this.logger.error('Bulk Upload job posts to search failed!', {
        type: 'BULK_UPLOAD_JOBS_TO_SEARCH_FAILED',
        err,
        iterations,
        fetched,
        attempts,
      });
      return;
    }
    this.logger.info('Bulk uploaded jobs to search successfully', {
      type: 'BULK_UPLOAD_JOBS_TO_SEARCH_SUCCESS',
      iterations,
      attempts,
      fetched,
    });
  }

  /**
   * Deletes jobs, that are currently soft deleted, from the search index.
   */
  async removeJobsFromIndex(): Promise<void> {
    const take = JobsService.PARALLEL_DELETE_LIMIT;
    const fetchedSet = new Set();
    const indexDef = await this.svcSearchService.getIndexDef();
    let attempts = 0;
    let fetched = 0;
    let iterations = 0;
    try {
      while (true) {
        const { items: jobs } = await this.findAll({
          where: {
            searchIndex: indexDef.index,
            deletedAt: {
              not: {
                equals: null,
              },
            },
          },
          take,
        });
        jobs.forEach(({ id }: JobDto) => fetchedSet.add(id));
        const newFetched = fetchedSet.size;
        if (newFetched === fetched) {
          // this is a failsafe mechanism, in case something goes wrong with the synchronization, to avoid infinite loops
          break;
        }
        fetched = newFetched;
        iterations++;
        attempts += jobs.length;
        // TODO: create bulk delete method (not one by one as now)
        await Promise.all(jobs.map((job) => this.tryRemoveFromSearch(job.id)));
      }
    } catch (err) {
      this.logger.error('Bulk Upload job posts to search failed!', {
        type: 'BULK_DELETE_JOBS_FROM_SEARCH_FAILED',
        err,
        iterations,
        fetched,
        attempts,
      });
      return;
    }
    this.logger.info('Bulk deleted jobs from search successfully', {
      type: 'BULK_DELETE_JOBS_FROM_SEARCH_SUCCESS',
      iterations,
      attempts,
      fetched,
    });
  }

  async syncJobsWithSearch(): Promise<void> {
    await this.uploadJobsToIndex(); // always resolves
    await this.removeJobsFromIndex(); // always resolves
  }

  async setupTasks() {
    try {
      this.logger.info('Setting up tasks', { type: 'SETUP_TASKS_STARTED' });
      for (const jobDef of TASKS_QUEUE_REPEATABLE_JOBS) {
        await this.tasksQ.add(jobDef.name, jobDef.data, jobDef.options);
      }
      const tasks = await this.tasksQ.getRepeatableJobs();
      for (const task of tasks) {
        const findMatchingDef = TASKS_QUEUE_REPEATABLE_JOBS.find(
          (t) => t.name === task.name,
        );
        if (
          !findMatchingDef ||
          task.cron !== findMatchingDef.options.repeat.cron
        ) {
          await this.tasksQ.removeRepeatableByKey(task.key);
          this.logger.warn('Removed repeatable task with old configuration', {
            type: 'REMOVED_JOBS_TASK',
            task,
          });
        }
      }
      this.logger.info('Setting up tasks', { type: 'SETUP_TASKS_FINISHED' });
    } catch (err) {
      this.logger.error('Failed to setup tasks', {
        type: 'JOBS_SETUP_TASKS_FAILED',
        err,
      });
    }
  }
}
