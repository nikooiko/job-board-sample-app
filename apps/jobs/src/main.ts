import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestJSLoggerService } from '@app/core/logger/services/nestjs-logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(NestJSLoggerService));
  const version = 1;
  const port = 4000;
  const apiPath = `private/api/v${version}`;
  app.setGlobalPrefix(apiPath);
  const config = new DocumentBuilder()
    .setTitle('Jobs SVC API')
    .setVersion(`${version}.0`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPath, app, document);
  await app.listen(port);
}

bootstrap();
