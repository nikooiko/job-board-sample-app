import { Test, TestingModule } from '@nestjs/testing';
import { SvcJobsService } from './svc-jobs.service';
import { ConfigModule } from '@nestjs/config';
import jobsConfig from '../config/svc-jobs.config';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from '@app/core/core.module';

describe('SvcJobsService', () => {
  let service: SvcJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ConfigModule.forFeature(jobsConfig), HttpModule],
      providers: [SvcJobsService],
    }).compile();

    service = module.get<SvcJobsService>(SvcJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
