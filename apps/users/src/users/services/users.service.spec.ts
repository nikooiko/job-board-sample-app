import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { LoggerModule } from '@app/core/logger/logger.module';
import { UsersPrismaService } from '../../users-prisma/services/users-prisma.service';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import usersConfig from '../config/users.config';

describe('UsersService', () => {
  let service: UsersService;
  const mockUsersPrismaService = mockDeep<UsersPrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, ConfigModule.forFeature(usersConfig)],
      providers: [UsersService, UsersPrismaService],
    })
      .overrideProvider(UsersPrismaService)
      .useValue(mockUsersPrismaService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
