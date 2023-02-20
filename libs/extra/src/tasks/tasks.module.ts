import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import redisConfig, { REDIS_CONFIG_KEY } from '../redis/config/redis.config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config =
          configService.get<ConfigType<typeof redisConfig>>(REDIS_CONFIG_KEY);
        if (!config) {
          throw new Error('Redis configuration is not defined');
        }
        return {
          redis: config,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class TasksModule extends BullModule {}
