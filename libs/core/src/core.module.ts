import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { SecurityModule } from './security/security.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';
import { CookiesModule } from './cookies/cookies.module';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule /* global */,
    SecurityModule /* must be imported before other modules as it applies some security-related middleware */,
    ErrorHandlingModule,
    ValidationModule,
    CookiesModule,
  ],
})
export class CoreModule {}
