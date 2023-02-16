import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CoreModule } from '@app/core/core.module';
import { JobsModule } from './jobs/jobs.module';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';

@Module({
  imports: [
    CoreModule /* must be imported before other modules as it applies some security-related middleware */,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(LOGGER) private logger: Logger) {}

  onApplicationBootstrap(): any {
    this.logger.info('Jobs app bootstrap success!', {
      type: 'JOBS_BOOTSTRAP',
    });
  }
}
