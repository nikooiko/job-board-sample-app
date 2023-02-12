import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SvcJobsService } from './services/svc-jobs.service';
import jobsConfig from './config/svc-jobs.config';

@Module({
  imports: [ConfigModule.forFeature(jobsConfig), HttpModule],
  providers: [SvcJobsService],
  exports: [SvcJobsService],
})
export class SvcJobsModule {}
