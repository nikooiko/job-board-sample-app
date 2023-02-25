import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { mockDeep } from 'jest-mock-extended';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  const mockJobsService = mockDeep<UsersService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockJobsService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
