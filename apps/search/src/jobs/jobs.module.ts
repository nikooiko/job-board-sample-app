import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { JobsService } from './services/jobs.service';
import { JobsController } from './controllers/jobs.controller';
import { ElasticsearchModule } from '@app/extra/elasticsearch/elasticsearch.module';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';

@Module({
  imports: [ElasticsearchModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule implements OnApplicationBootstrap {
  constructor(
    private jobsService: JobsService,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async onApplicationBootstrap() {
    await this.jobsService.init();
    this.logger.info('Jobs bootstrap success!', {
      type: 'JOBS_BOOTSTRAP',
    });
  }
}
