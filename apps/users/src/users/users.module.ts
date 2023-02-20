import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './services/users.service';
import usersConfig from './config/users.config';
import { UsersPrismaModule } from '../users-prisma/users-prisma.module';

@Module({
  imports: [ConfigModule.forFeature(usersConfig), UsersPrismaModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
