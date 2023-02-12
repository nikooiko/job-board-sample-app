import { Test, TestingModule } from '@nestjs/testing';
import { SvcJobsService } from '@app/extra/svc-jobs/services/svc-jobs.service';
import { mockDeep } from 'jest-mock-extended';
import { JobsController } from './jobs.controller';

describe('JobsController', () => {
  let controller: JobsController;
  const mockJobsService = mockDeep<SvcJobsService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [SvcJobsService],
    })
      .overrideProvider(SvcJobsService)
      .useValue(mockJobsService)
      .compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
