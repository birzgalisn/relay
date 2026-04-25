import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

import type { CreateLinkInput } from '../inputs/create-link.input';
import type { Link } from '../models/link.model';

@Injectable()
export class CreateLinkUseCase {
  constructor(private readonly prisma: PrismaService) {}

  execute(input: CreateLinkInput): Promise<Link> {
    return this.prisma.link.create({
      data: {
        title: input.title,
        url: input.url,
        description: input.description,
      },
    });
  }
}
