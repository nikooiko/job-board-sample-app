import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CoreModule } from '@app/core/core.module';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';

@Module({
  imports: [
    CoreModule /* must be imported before other modules as it applies some security-related middleware */,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(LOGGER) private logger: Logger) {}

  onApplicationBootstrap(): any {
    this.logger.info('Search app bootstrap success!', {
      type: 'SEARCH_BOOTSTRAP',
    });
  }
}
