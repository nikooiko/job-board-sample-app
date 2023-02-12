import { Module } from '@nestjs/common';
import { SvcSearchModule } from '@app/extra/svc-search/svc-search.module';
import { JobsSearchController } from './controllers/jobs-search.controller';

@Module({
  imports: [SvcSearchModule],
  controllers: [JobsSearchController],
})
export class JobsSearchModule {}
