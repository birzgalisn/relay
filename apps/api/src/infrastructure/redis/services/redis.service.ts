import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';

import { redisConfig } from '../../config/redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  readonly client: Redis;

  constructor(@Inject(redisConfig.KEY) redis: ConfigType<typeof redisConfig>) {
    this.client = new Redis(redis.url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    this.client.on('error', (err) => {
      this.logger.error(err);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
