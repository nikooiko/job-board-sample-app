import { NestFactory } from '@nestjs/core';
import { NestJSLoggerService } from '@app/core/logger/services/nestjs-logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(NestJSLoggerService));
  const version = 1;
  const port = 4002;
  const apiPath = `private/api/v${version}/users-svc`;
  app.setGlobalPrefix(apiPath);
  const config = new DocumentBuilder()
    .setTitle('Users SVC API')
    .setVersion(`${version}.0`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPath, app, document);
  await app.listen(port);
}

bootstrap();
