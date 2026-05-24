import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import 'reflect-metadata';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
  );

  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    // @fastify/cors must allow tus-js-client request headers on cross-origin preflight.
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Forwarded',
      'Tus-Resumable',
      'Tus-Version',
      'Upload-Concat',
      'Upload-Defer-Length',
      'Upload-Length',
      'Upload-Metadata',
      'Upload-Offset',
      'X-Forwarded-Host',
      'X-Forwarded-Proto',
      'X-HTTP-Method-Override',
      'X-Requested-With',
    ],
    exposedHeaders: [
      'Location',
      'Upload-Offset',
      'Upload-Length',
      'Tus-Resumable',
      'Tus-Version',
      'Tus-Max-Size',
      'Tus-Extension',
      'Upload-Metadata',
      'Upload-Defer-Length',
      'Upload-Concat',
    ],
  });
  app.enableShutdownHooks();

  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
