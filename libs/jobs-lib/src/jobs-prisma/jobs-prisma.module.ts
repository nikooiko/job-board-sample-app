import { Module } from '@nestjs/common';
import { JobsPrismaService } from './services/jobs-prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { JobsPrismaExceptionsFilter } from '@app/jobs-lib/jobs-prisma/filters/jobs-prisma-exceptions.filter';

@Module({
  providers: [
    JobsPrismaService,
    {
      provide: APP_FILTER,
      useClass: JobsPrismaExceptionsFilter,
    },
  ],
  exports: [JobsPrismaService],
})
export class JobsPrismaModule {}
