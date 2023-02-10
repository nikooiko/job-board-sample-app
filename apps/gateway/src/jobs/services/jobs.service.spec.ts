import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { ConfigModule } from '@nestjs/config';
import jobsConfig from '../config/jobs.config';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from '@app/core/core.module';

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ConfigModule.forFeature(jobsConfig), HttpModule],
      providers: [JobsService],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
