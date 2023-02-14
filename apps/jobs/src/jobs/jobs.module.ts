import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { JobsService } from './services/jobs.service';
import { JobsController } from './controllers/jobs.controller';
import { JobsPrismaModule } from '../jobs-prisma/jobs-prisma.module';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { SvcSearchModule } from '@app/extra/svc-search/svc-search.module';

@Module({
  imports: [JobsPrismaModule, SvcSearchModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule implements OnApplicationBootstrap {
  constructor(
    private jobsService: JobsService,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async onApplicationBootstrap() {
    this.logger.info('Jobs bootstrap success!', {
      type: 'JOBS_BOOTSTRAP',
    });
  }
}
