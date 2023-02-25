import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import authConfig, { AUTH_CONFIG_KEY } from './config/auth.config';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SvcUsersModule } from '@app/extra/svc-users/svc-users.module';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config =
          configService.get<ConfigType<typeof authConfig>>(AUTH_CONFIG_KEY);
        if (!config) {
          throw new Error('Auth configuration is not defined');
        }
        return { secret: config.accessToken.secret };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    SvcUsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
