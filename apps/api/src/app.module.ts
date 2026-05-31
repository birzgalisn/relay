import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@repo/drizzle';

import { GraphqlModule } from './infrastructure/graphql/graphql.module';
import { MediaModule } from './infrastructure/media/media.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { RedisModule } from './infrastructure/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    RedisModule,
    QueueModule,
    GraphqlModule,
    MediaModule,
  ],
})
export class AppModule {}
