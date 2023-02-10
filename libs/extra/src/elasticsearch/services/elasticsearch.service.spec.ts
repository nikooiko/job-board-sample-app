import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from './elasticsearch.service';
import elasticsearchConfig from '@app/extra/elasticsearch/config/elasticsearch.config';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@app/core/core.module';

describe('ElasticsearchService', () => {
  let service: ElasticsearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ConfigModule.forFeature(elasticsearchConfig)],
      providers: [ElasticsearchService],
    }).compile();

    service = module.get<ElasticsearchService>(ElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
