import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { ElasticsearchService } from '@app/extra/elasticsearch/services/elasticsearch.service';
import { mockDeep } from 'jest-mock-extended';
import { CoreModule } from '@app/core/core.module';

describe('JobsService', () => {
  let service: JobsService;
  const mockElasticSearchService = mockDeep<ElasticsearchService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [JobsService, ElasticsearchService],
    })
      .overrideProvider(ElasticsearchService)
      .useValue(mockElasticSearchService)
      .compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
