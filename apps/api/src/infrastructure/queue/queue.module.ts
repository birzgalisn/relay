import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { redisConfig } from '../config/redis.config';
import { POST_FILE_IMAGE_VALIDATION_QUEUE } from './tokens/queue.tokens';

const redisFromConfig = redisConfig.asProvider();

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: redisFromConfig.imports,
      inject: redisFromConfig.inject,
      useFactory: (redis: ConfigType<typeof redisConfig>) => ({
        connection: { url: redis.url },
      }),
    }),
    BullModule.registerQueue({ name: POST_FILE_IMAGE_VALIDATION_QUEUE }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
