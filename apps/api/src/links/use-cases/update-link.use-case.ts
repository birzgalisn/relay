import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

import type { UpdateLinkInput } from '../inputs/update-link.input';
import type { Link } from '../models/link.model';

@Injectable()
export class UpdateLinkUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, input: UpdateLinkInput): Promise<Link> {
    const existing = await this.prisma.link.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Link ${id} not found`);
    }

    return this.prisma.link.update({
      where: { id },
      data: {
        ...(input.title ? { title: input.title } : {}),
        ...(input.url ? { url: input.url } : {}),
        ...(input.description ? { description: input.description } : {}),
      },
    });
  }
}
