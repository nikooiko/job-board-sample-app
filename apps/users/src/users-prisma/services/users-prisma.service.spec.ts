import { Test, TestingModule } from '@nestjs/testing';
import { UsersPrismaService } from './users-prisma.service';

describe('JobsPrismaService', () => {
  let service: UsersPrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [UsersPrismaService],
    }).compile();

    service = module.get<UsersPrismaService>(UsersPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
