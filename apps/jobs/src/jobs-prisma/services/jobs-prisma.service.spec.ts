import { Test, TestingModule } from '@nestjs/testing';
import { JobsPrismaService } from './jobs-prisma.service';

describe('JobsPrismaService', () => {
  let service: JobsPrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [JobsPrismaService],
    }).compile();

    service = module.get<JobsPrismaService>(JobsPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
