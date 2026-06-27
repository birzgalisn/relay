import { Injectable } from '@nestjs/common';
import { DrizzleService, PostFileUploadStatus, postFiles } from '@repo/drizzle';
import { and, eq } from 'drizzle-orm';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';

@Injectable()
export class MarkPostFileReadyUseCase implements UseCase<string, void> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(postFileId: string): Promise<void> {
    await this.drizzle.db
      .update(postFiles)
      .set({ uploadStatus: PostFileUploadStatus.READY })
      .where(
        and(
          eq(postFiles.id, postFileId),
          eq(postFiles.uploadStatus, PostFileUploadStatus.PROCESSING),
        ),
      );
  }
}
