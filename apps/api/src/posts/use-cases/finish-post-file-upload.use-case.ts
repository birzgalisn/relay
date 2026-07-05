import { Injectable } from '@nestjs/common';
import { DrizzleService, postFiles, posts } from '@repo/drizzle';
import { AppError, SUPPORTED_MEDIA_MIME_TYPES } from '@repo/shared';
import { and, eq } from 'drizzle-orm';

import { MediaService } from '../../infrastructure/media/services/media.service';
import type { UseCase } from '../../shared/interfaces/use-case.interface';
import type { FinishPostFileUploadInput } from '../schemas/finish-post-file-upload.schema';
import { isPostAcceptingUploads } from '../util/post-status.util';

export type ClaimedPostFileUpload = {
  postFileId: string;
  tusUploadId: string;
  storageKey: string;
};

@Injectable()
export class FinishPostFileUploadUseCase implements UseCase<FinishPostFileUploadInput, ClaimedPostFileUpload | null> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly media: MediaService,
  ) {}

  async execute(input: FinishPostFileUploadInput): Promise<ClaimedPostFileUpload | null> {
    const claimed = await this.claim(input);

    if (!claimed) {
      return null;
    }

    await this.media.promote({
      tusUploadId: claimed.tusUploadId,
      storageKey: claimed.storageKey,
    });

    return claimed;
  }

  private async claim(input: FinishPostFileUploadInput): Promise<ClaimedPostFileUpload | null> {
    return this.drizzle.db.transaction(async (tx) => {
      const post = await tx.query.posts.findFirst({
        where: eq(posts.id, input.postId),
        columns: { id: true, status: true },
      });

      if (!post || !isPostAcceptingUploads(post.status)) {
        throw AppError.notFound(`Post ${input.postId} not found or not accepting uploads`, {
          postId: input.postId,
        });
      }

      const slot = await tx.query.postFiles.findFirst({
        where: and(eq(postFiles.postId, input.postId), eq(postFiles.sortOrder, input.sortOrder)),
        columns: { id: true, storageKey: true },
      });

      if (!slot) {
        throw AppError.conflict(
          `No upload slot at sortOrder ${input.sortOrder} for post ${input.postId}`,
          { postId: input.postId, sortOrder: input.sortOrder },
        );
      }

      if (slot.storageKey) {
        return null;
      }

      const storageKey = `${slot.id}${SUPPORTED_MEDIA_MIME_TYPES[input.mimeType]}`;

      await tx
        .update(postFiles)
        .set({ mimeType: input.mimeType, byteSize: input.byteSize, storageKey })
        .where(eq(postFiles.id, slot.id));

      return { postFileId: slot.id, tusUploadId: input.tusUploadId, storageKey };
    });
  }
}
