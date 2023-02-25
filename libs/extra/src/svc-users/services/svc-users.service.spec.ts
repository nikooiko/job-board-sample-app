import { Test, TestingModule } from '@nestjs/testing';
import { SvcUsersService } from './svc-users.service';
import { ConfigModule } from '@nestjs/config';
import usersConfig from '../config/svc-users.config';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from '@app/core/core.module';

describe('SvcUsersService', () => {
  let service: SvcUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ConfigModule.forFeature(usersConfig), HttpModule],
      providers: [SvcUsersService],
    }).compile();

    service = module.get<SvcUsersService>(SvcUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
