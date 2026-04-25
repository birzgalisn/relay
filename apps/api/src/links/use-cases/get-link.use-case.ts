import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

import type { Link } from '../models/link.model';

@Injectable()
export class GetLinkUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<Link> {
    const link = await this.prisma.link.findUnique({ where: { id } });

    if (!link) {
      throw new NotFoundException(`Link ${id} not found`);
    }

    return link;
  }
}
