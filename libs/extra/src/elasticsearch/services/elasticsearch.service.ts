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
        const { acknowledged } = await this.indices.putMapping({
          index: def.index,
          properties: def.mappings?.properties,
        });
        if (acknowledged) {
          this.logger.info('Updated index mapping', {
            type: 'INDEX_UPDATED',
            index: def.index,
          });
        } else {
          this.logger.warn('Update index mapping failed', {
            type: 'INDEX_UPDATE_FAILED',
            index: def.index,
          });
        }
        return;
      }
      await this.indices.create(def);
      this.logger.info('Created index', {
        type: 'INDEX_CREATED',
        index: def.index,
      });
    } catch (err) {
      this.logger.error('Error checkOrCreate index', {
        type: 'CHECK_OR_CREATE_INDEX_ERROR',
        err,
        index: def.index,
      });
    }
  }
}
