import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SvcUsersService } from './services/svc-users.service';
import usersConfig from './config/svc-users.config';

@Module({
  imports: [ConfigModule.forFeature(usersConfig), HttpModule],
  providers: [SvcUsersService],
  exports: [SvcUsersService],
})
export class SvcUsersModule {}
