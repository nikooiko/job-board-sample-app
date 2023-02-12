import { Test, TestingModule } from '@nestjs/testing';
import { SvcSearchService } from './svc-search.service';
import { ConfigModule } from '@nestjs/config';
import jobsConfig from '../config/svc-search.config';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from '@app/core/core.module';

describe('SvcSearchService', () => {
  let service: SvcSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, ConfigModule.forFeature(jobsConfig), HttpModule],
      providers: [SvcSearchService],
    }).compile();

    service = module.get<SvcSearchService>(SvcSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
