import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { mockDeep } from 'jest-mock-extended';
import { UsersPrismaService } from '../../users-prisma/services/users-prisma.service';
import { JobsPrismaService } from '../../../../jobs/src/jobs-prisma/services/jobs-prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUsersPrismaService = mockDeep<UsersPrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .overrideProvider(JobsPrismaService)
      .useValue(mockUsersPrismaService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
