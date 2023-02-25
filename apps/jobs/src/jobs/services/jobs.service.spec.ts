import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';
import { LoggerModule } from '@app/core/logger/logger.module';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { JobsPrismaService } from '../../jobs-prisma/services/jobs-prisma.service';
import { TASKS_QUEUE } from '../constants/tasks-queue.constant';
import { JobsService } from './jobs.service';

describe('JobsService', () => {
  let service: JobsService;
  const mockJobsPrismaService = mockDeep<JobsPrismaService>();
  const mockSvcSearchService = mockDeep<SvcSearchService>();
  const queueToken = getQueueToken(TASKS_QUEUE);
  const mockQueue = mockDeep<Queue>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        JobsService,
        JobsPrismaService,
        SvcSearchService,
        {
          provide: queueToken,
          useValue: mockQueue,
        },
      ],
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
