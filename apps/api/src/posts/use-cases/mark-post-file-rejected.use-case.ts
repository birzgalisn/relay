import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService, PostFileUploadStatus, postFiles } from '@repo/drizzle';
import { and, eq } from 'drizzle-orm';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';

export type MarkPostFileRejectedInput = {
  postFileId: string;
  reason: string;
};

@Injectable()
export class MarkPostFileRejectedUseCase implements UseCase<MarkPostFileRejectedInput, void> {
  private readonly logger = new Logger(MarkPostFileRejectedUseCase.name);

  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ postFileId, reason }: MarkPostFileRejectedInput): Promise<void> {
    await this.drizzle.db
      .update(postFiles)
      .set({ uploadStatus: PostFileUploadStatus.FAILED })
      .where(
        and(
          eq(postFiles.id, postFileId),
          eq(postFiles.uploadStatus, PostFileUploadStatus.PROCESSING),
        ),
      );

    this.logger.log(`Post file ${postFileId} rejected: ${reason}`);
  }
}
