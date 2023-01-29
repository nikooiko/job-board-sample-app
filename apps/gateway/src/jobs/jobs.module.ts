import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JobsService } from './services/jobs.service';
import { JobsController } from './controllers/jobs.controller';
import jobsConfig from './config/jobs.config';

@Module({
  imports: [ConfigModule.forFeature(jobsConfig), HttpModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
