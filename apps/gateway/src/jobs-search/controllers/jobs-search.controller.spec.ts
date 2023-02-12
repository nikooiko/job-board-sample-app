import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';
import { JobsSearchController } from './jobs-search.controller';

describe('JobsSearchController', () => {
  let controller: JobsSearchController;
  const mockSvcSearchService = mockDeep<SvcSearchService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsSearchController],
      providers: [SvcSearchService],
    })
      .overrideProvider(SvcSearchService)
      .useValue(mockSvcSearchService)
      .compile();

    controller = module.get<JobsSearchController>(JobsSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
