import { Injectable } from '@nestjs/common';
import { DrizzleService, postFiles } from '@repo/drizzle';
import { and, eq, isNull } from 'drizzle-orm';

import type { UseCase } from '../../shared/interfaces/use-case.interface';

@Injectable()
export class MarkPostFileValidatedUseCase implements UseCase<string, void> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(postFileId: string): Promise<void> {
    await this.drizzle.db
      .update(postFiles)
      .set({ validatedAt: new Date() })
      .where(and(eq(postFiles.id, postFileId), isNull(postFiles.validatedAt)));
  }
}
