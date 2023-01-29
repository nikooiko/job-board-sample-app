import { Module } from '@nestjs/common';
import { JobsService } from './services/jobs.service';
import { JobsController } from './controllers/jobs.controller';
import { JobsPrismaModule } from '../jobs-prisma/jobs-prisma.module';

@Module({
  imports: [JobsPrismaModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
