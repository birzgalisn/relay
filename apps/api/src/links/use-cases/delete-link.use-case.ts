import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

@Injectable()
export class DeleteLinkUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<void> {
    const { count } = await this.prisma.link.deleteMany({ where: { id } });

    if (count === 0) {
      throw new NotFoundException(`Link ${id} not found`);
    }
  }
}
