import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';
import { DrizzleService } from '@repo/drizzle';

import type { UseCase } from '../../shared/interfaces/use-case.interface';

@Injectable()
export class CheckDatabaseReachableUseCase implements UseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(): Promise<void> {
    try {
      await this.drizzle.ping();
    } catch {
      throw AppError.serviceUnavailable('Database unreachable');
    }
  }
}
