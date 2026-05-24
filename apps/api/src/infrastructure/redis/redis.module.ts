import { Global, Module } from '@nestjs/common';

import { redisConfig } from '../config/redis.config';
import { RedisService } from './redis.service';

const redisFromConfig = redisConfig.asProvider();

@Global()
@Module({
  imports: [...redisFromConfig.imports],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
