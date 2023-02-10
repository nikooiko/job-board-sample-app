import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { CoreModule } from '@app/core/core.module';
import { JobsPrismaService } from '../../jobs-prisma/services/jobs-prisma.service';
import { mockDeep } from 'jest-mock-extended';

describe('JobsService', () => {
  let service: JobsService;
  const mockJobsPrismaService = mockDeep<JobsPrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [JobsService, JobsPrismaService],
    })
      .overrideProvider(JobsPrismaService)
      .useValue(mockJobsPrismaService)
      .compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
