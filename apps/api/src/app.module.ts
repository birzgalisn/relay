import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { DrizzleModule } from '@repo/drizzle';

import { appConfig } from './infrastructure/config/app.config';
import { corsConfig } from './infrastructure/config/cors.config';
import { NodeEnv } from './infrastructure/config/interfaces/app-env.interface';
import { CORS_HEADERS } from './infrastructure/cors/constants/cors.constants';
import { CorsModule } from './infrastructure/cors/cors.module';
import { GraphqlExceptionFilter } from './infrastructure/errors/graphql-exception.filter';
import { GraphqlModule } from './infrastructure/graphql/graphql.module';
import { MediaModule } from './infrastructure/media/media.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { RedisModule } from './infrastructure/redis/redis.module';

const appEnvFromConfig = appConfig.asProvider();
const corsEnvFromConfig = corsConfig.asProvider();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CorsModule.registerAsync({
      imports: [...appEnvFromConfig.imports, ...corsEnvFromConfig.imports],
      inject: [...appEnvFromConfig.inject, ...corsEnvFromConfig.inject],
      useFactory: (app: ConfigType<typeof appConfig>, cors: ConfigType<typeof corsConfig>) => ({
        origin:
          app.nodeEnv !== NodeEnv.PRODUCTION
            ? true
            : [`https://app.${cors.cname}`, `http://app.${cors.cname}`],
        ...CORS_HEADERS,
      }),
    }),
    DrizzleModule,
    RedisModule,
    QueueModule,
    GraphqlModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphqlExceptionFilter,
    },
  ],
})
export class AppModule {}
