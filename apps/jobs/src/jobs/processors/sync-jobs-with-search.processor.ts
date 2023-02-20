import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { JobsService } from '../services/jobs.service';
import { SYNC_JOBS_WITH_SEARCH_TASK } from '../constants/tasks-queue-repeatable-jobs';
import { TASKS_QUEUE } from '../constants/tasks-queue.constant';

@Processor(TASKS_QUEUE)
export class SyncJobsWithSearchProcessor {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private jobsService: JobsService,
  ) {}

  @Process(SYNC_JOBS_WITH_SEARCH_TASK.name)
  async handleSyncJobsWithSearch(job: Job) {
    const start = Date.now();
    this.logger.info('Start processing...', {
      type: 'SYNC_JOBS_WITH_SEARCH_TASK_STARTED',
      job,
    });
    await this.jobsService.syncJobsWithSearch();
    this.logger.info('Processing completed', {
      type: 'SYNC_JOBS_WITH_SEARCH_TASK_FINISHED',
      job,
      durationMS: Date.now() - start,
    });
  }
}
