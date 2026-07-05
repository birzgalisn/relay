import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import 'reflect-metadata';

import { AppModule } from './app.module';
import { appConfig } from './infrastructure/config/app.config';
import type { AppEnvConfig } from './infrastructure/config/interfaces/app-env.interface';
import { buildCorsOptions } from './infrastructure/cors/util/build-cors-options.util';
import { configureSharp } from './infrastructure/sharp/util/configure-sharp.util';

configureSharp();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
  );

  const appEnv = app.get(ConfigService).getOrThrow<AppEnvConfig>(appConfig.KEY);
  app.enableCors(buildCorsOptions(appEnv));
  app.enableShutdownHooks();

  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
