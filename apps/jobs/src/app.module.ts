import { Module } from '@nestjs/common';
import { CoreModule } from '@app/core/core.module';
import { JobsPrismaModule } from './jobs-prisma/jobs-prisma.module';

@Module({
  imports: [
    CoreModule /* must be imported before other modules as it applies some security-related middleware */,
    JobsPrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
