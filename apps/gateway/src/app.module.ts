import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CoreModule } from '@app/core/core.module';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { JobsModule } from './jobs/jobs.module';
import { JobsSearchModule } from './jobs-search/jobs-search.module';

@Module({
  imports: [
    CoreModule /* must be imported before other modules as it applies some security-related middleware */,
    JobsModule,
    JobsSearchModule,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(LOGGER) private logger: Logger) {}

  onApplicationBootstrap(): any {
    this.logger.info('Gateway app bootstrap success!', {
      type: 'GATEWAY_BOOTSTRAP',
    });
  }
}
