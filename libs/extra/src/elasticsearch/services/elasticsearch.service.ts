import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigType } from '@nestjs/config';
import elasticsearchConfig from '../config/elasticsearch.config';
import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';
import { LOGGER } from '@app/core/logger/factories/logger.factory';

@Injectable()
export class ElasticsearchService extends Client {
  constructor(
    @Inject(elasticsearchConfig.KEY)
    private readonly config: ConfigType<typeof elasticsearchConfig>,
    @Inject(LOGGER)
    private readonly logger: Logger,
  ) {
    super(config);
  }

  async checkOrCreateIndex(def: IndicesCreateRequest) {
    try {
      if (await this.indices.exists({ index: def.index })) {
        this.logger.info('Index already exists', {
          type: 'INDEX_EXISTS',
          index: def.index,
        });
        return;
      }
      this.logger.info('Creating index', {
        type: 'CREATING_INDEX',
        index: def.index,
      });
      await this.indices.create(def);
    } catch (err) {
      this.logger.error('Error checkOrCreate index', {
        type: 'CHECK_OR_CREATE_INDEX_ERROR',
        err,
        index: def.index,
      });
    }
  }
}
