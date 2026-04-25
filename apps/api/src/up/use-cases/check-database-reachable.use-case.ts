import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

import { UpStatus } from '../enums/up-status.enum';

@Injectable()
export class CheckDatabaseReachableUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<UpStatus> {
    try {
      await this.prisma.$queryRaw<number>`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException();
    }

    return UpStatus.OK;
  }
}
