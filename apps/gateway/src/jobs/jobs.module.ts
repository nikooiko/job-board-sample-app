import { Module } from '@nestjs/common';
import { SvcJobsModule } from '@app/extra/svc-jobs/svc-jobs.module';
import { JobsController } from './controllers/jobs.controller';

@Module({
  imports: [SvcJobsModule],
  controllers: [JobsController],
  providers: [],
})
export class JobsModule {}
