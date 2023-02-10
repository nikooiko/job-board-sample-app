import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ElasticsearchService } from './services/elasticsearch.service';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { ConfigModule } from '@nestjs/config';
import elasticsearchConfig from './config/elasticsearch.config';

@Module({
  imports: [ConfigModule.forFeature(elasticsearchConfig)],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule implements OnApplicationBootstrap {
  constructor(
    private elasticsearchService: ElasticsearchService,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async onApplicationBootstrap() {
    this.logger.info('Elastic search bootstrap success!', {
      type: 'ELASTICSEARCH_BOOTSTRAP',
    });
  }
}
