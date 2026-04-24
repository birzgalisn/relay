import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

@Injectable()
export class CheckDatabaseReachableUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<string> {
    try {
      await this.prisma.$queryRaw<number>`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException();
    }

    return 'ok';
  }
}
