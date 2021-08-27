import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import * as packageJson from '../package.json';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Add middlewares.
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  app.enableCors({ origin: '*' });
  app.use(helmet());

  // Swagger config.
  const server =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : 'https://api.aniskip.com';

  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addServer(server)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api-docs', app, document);

  await app.listen(5000);
}
bootstrap();
