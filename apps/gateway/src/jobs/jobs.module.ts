import { Module } from '@nestjs/common';
import { SvcJobsModule } from '@app/extra/svc-jobs/svc-jobs.module';
import { SvcSearchModule } from '@app/extra/svc-search/svc-search.module';
import { JobsController } from './controllers/jobs.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SvcJobsModule, SvcSearchModule, AuthModule],
  controllers: [JobsController],
  providers: [],
})
export class JobsModule {}
