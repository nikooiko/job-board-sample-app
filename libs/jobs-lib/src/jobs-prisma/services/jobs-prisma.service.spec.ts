import { Test, TestingModule } from '@nestjs/testing';
import { JobsPrismaService } from './jobs-prisma.service';

describe('JobsPrismaService', () => {
  let service: JobsPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsPrismaService],
    }).compile();

    service = module.get<JobsPrismaService>(JobsPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
