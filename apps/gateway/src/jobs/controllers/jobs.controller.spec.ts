import { Test, TestingModule } from '@nestjs/testing';
import { SvcJobsService } from '@app/extra/svc-jobs/services/svc-jobs.service';
import { mockDeep } from 'jest-mock-extended';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';
import { JobsController } from './jobs.controller';

describe('JobsController', () => {
  let controller: JobsController;
  const mockSvcJobsService = mockDeep<SvcJobsService>();
  const mockSvcSearchService = mockDeep<SvcSearchService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [SvcJobsService, SvcSearchService],
    })
      .overrideProvider(SvcJobsService)
      .useValue(mockSvcJobsService)
      .overrideProvider(SvcSearchService)
      .useValue(mockSvcSearchService)
      .compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
