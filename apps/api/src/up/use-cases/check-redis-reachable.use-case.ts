import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { RedisService } from '../../infrastructure/redis/redis.service';
import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';

@Injectable()
export class CheckRedisReachableUseCase implements UseCase {
  constructor(private readonly redis: RedisService) {}

  async execute(): Promise<void> {
    try {
      await this.redis.client.ping();
    } catch {
      throw new ServiceUnavailableException('Redis unreachable');
    }
  }
}
