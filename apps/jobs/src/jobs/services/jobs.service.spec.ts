import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { CoreModule } from '@app/core/core.module';
import { JobsPrismaService } from '../../jobs-prisma/services/jobs-prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';

describe('JobsService', () => {
  let service: JobsService;
  const mockJobsPrismaService = mockDeep<JobsPrismaService>();
  const mockSvcSearchService = mockDeep<SvcSearchService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [JobsService, JobsPrismaService, SvcSearchService],
    })
      .overrideProvider(JobsPrismaService)
      .useValue(mockJobsPrismaService)
      .overrideProvider(SvcSearchService)
      .useValue(mockSvcSearchService)
      .compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
