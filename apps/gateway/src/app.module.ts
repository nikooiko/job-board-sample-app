import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CoreModule } from '@app/core/core.module';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { JobsModule } from './jobs/jobs.module';

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
    this.logger.info('Gateway app bootstrap success!', {
      type: 'GATEWAY_BOOTSTRAP',
    });
  }
}
