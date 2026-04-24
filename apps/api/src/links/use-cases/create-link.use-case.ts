import { Injectable } from '@nestjs/common';
import type { CreateLinkDto, Link } from '@repo/api';
import { PrismaService } from '@repo/prisma';

@Injectable()
export class CreateLinkUseCase {
  constructor(private readonly prisma: PrismaService) {}

  execute(createLinkDto: CreateLinkDto): Promise<Link> {
    return this.prisma.link.create({
      data: {
        title: createLinkDto.title,
        url: createLinkDto.url,
        description: createLinkDto.description,
      },
    });
  }
}
