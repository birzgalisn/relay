import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

import type { Link } from '../models/link.model';

@Injectable()
export class ListLinksUseCase {
  constructor(private readonly prisma: PrismaService) {}

  execute(): Promise<Link[]> {
    return this.prisma.link.findMany({ orderBy: { createdAt: 'asc' } });
  }
}
