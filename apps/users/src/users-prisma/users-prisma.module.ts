import { Module } from '@nestjs/common';
import { UsersPrismaService } from './services/users-prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { UsersPrismaExceptionsFilter } from './filters/users-prisma-exceptions.filter';

@Module({
  providers: [
    UsersPrismaService,
    {
      provide: APP_FILTER,
      useClass: UsersPrismaExceptionsFilter,
    },
  ],
  exports: [UsersPrismaService],
})
export class UsersPrismaModule {}
