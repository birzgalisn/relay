import { Injectable } from '@nestjs/common';
import type { Link } from '@repo/api';
import { PrismaService } from '@repo/prisma';

@Injectable()
export class ListLinksUseCase {
  constructor(private readonly prisma: PrismaService) {}

  execute(): Promise<Link[]> {
    return this.prisma.link.findMany({ orderBy: { createdAt: 'asc' } });
  }
}
