import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { JobsService } from './services/jobs.service';
import { JobsController } from './controllers/jobs.controller';
import { JobsPrismaModule } from '../jobs-prisma/jobs-prisma.module';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { SvcSearchModule } from '@app/extra/svc-search/svc-search.module';
import { TasksModule } from '@app/extra/tasks/tasks.module';
import { SyncJobsWithSearchProcessor } from './processors/sync-jobs-with-search.processor';
import { TASKS_QUEUE } from './constants/tasks-queue.constant';

@Module({
  imports: [
    JobsPrismaModule,
    SvcSearchModule,
    TasksModule,
    TasksModule.registerQueue({
      name: TASKS_QUEUE,
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, SyncJobsWithSearchProcessor],
})
export class JobsModule implements OnApplicationBootstrap {
  constructor(
    private jobsService: JobsService,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async onApplicationBootstrap() {
    await this.jobsService.init(); // should always resolve
    this.logger.info('Jobs bootstrap success!', {
      type: 'JOBS_BOOTSTRAP',
    });
  }
}
