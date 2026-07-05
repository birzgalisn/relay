import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { DrizzleModule } from '@repo/drizzle';

import { appConfig } from './infrastructure/config/app.config';
import { GraphqlExceptionFilter } from './infrastructure/errors/graphql-exception.filter';
import { GraphqlModule } from './infrastructure/graphql/graphql.module';
import { MediaModule } from './infrastructure/media/media.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { RedisModule } from './infrastructure/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
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
