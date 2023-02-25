import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';
import { SvcUsersService } from '@app/extra/svc-users/services/svc-users.service';
import authConfig from '../config/auth.config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const svcUsersService = mock(SvcUsersService);
    const jwtService = mock(JwtService);
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(authConfig)],
      providers: [AuthService, SvcUsersService, JwtService],
    })
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .overrideProvider(SvcUsersService)
      .useValue(svcUsersService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
