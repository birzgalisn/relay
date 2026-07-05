import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import { RedisService } from '../../infrastructure/redis/services/redis.service';
import type { UseCase } from '../../shared/interfaces/use-case.interface';

@Injectable()
export class CheckRedisReachableUseCase implements UseCase {
  constructor(private readonly redis: RedisService) {}

  async execute(): Promise<void> {
    try {
      await this.redis.client.ping();
    } catch {
      throw AppError.serviceUnavailable('Redis unreachable');
    }
  }
}
