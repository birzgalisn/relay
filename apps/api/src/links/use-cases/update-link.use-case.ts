import { Injectable, NotFoundException } from '@nestjs/common';
import type { Link, UpdateLinkDto } from '@repo/api';
import { PrismaService } from '@repo/prisma';

@Injectable()
export class UpdateLinkUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, updateLinkDto: UpdateLinkDto): Promise<Link> {
    const existing = await this.prisma.link.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Link ${id} not found`);
    }

    return this.prisma.link.update({
      where: { id },
      data: updateLinkDto,
    });
  }
}
