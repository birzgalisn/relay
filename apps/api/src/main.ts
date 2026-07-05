import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import 'reflect-metadata';

import { AppModule } from './app.module';
import { configureSharp } from './infrastructure/sharp/util/configure-sharp.util';

configureSharp();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
  );

  app.enableShutdownHooks();

  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
