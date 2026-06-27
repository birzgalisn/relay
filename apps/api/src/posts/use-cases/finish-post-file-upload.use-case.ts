import { Injectable } from '@nestjs/common';
import { DrizzleService, postFiles, PostFileUploadStatus, posts } from '@repo/drizzle';
import { Upload } from '@tus/server';
import { and, eq } from 'drizzle-orm';

import { TusError } from '../../infrastructure/tus/tus.error';
import { formatZodErrorMessage } from '../../infrastructure/validation/format-zod-error-message';
import type { ValidatePostFileImageJob } from '../jobs/validate-post-file-image.job';
import { postFileTusUploadMetadataSchema } from '../schemas/post-file-tus-upload-metadata.schema';
import { isImageMimeType } from '../util/is-image-mime-type';
import { isPostAcceptingUploads } from '../util/post-status.util';

export type FinishPostFileUploadResult = {
  postId: string;
  validationJob: ValidatePostFileImageJob | null;
};

@Injectable()
export class FinishPostFileUploadUseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(upload: Upload): Promise<FinishPostFileUploadResult> {
    const parsed = postFileTusUploadMetadataSchema.safeParse(upload.metadata);

    if (!parsed.success) {
      throw new TusError(400, `Invalid upload metadata: ${formatZodErrorMessage(parsed.error)}`);
    }

    const { postId, sortOrder, filetype } = parsed.data;

    const byteSize = upload.size ?? null;
    const uploadStatus = isImageMimeType(filetype)
      ? PostFileUploadStatus.PROCESSING
      : PostFileUploadStatus.READY;

    const postFileIdForValidation = await this.drizzle.db.transaction(async (tx) => {
      const post = await tx.query.posts.findFirst({
        where: eq(posts.id, postId),
        columns: { id: true, status: true },
      });

      if (!post || !isPostAcceptingUploads(post.status)) {
        throw new TusError(404, `Post ${postId} not found or not accepting uploads`);
      }

      const existingByTus = await tx.query.postFiles.findFirst({
        where: and(eq(postFiles.postId, postId), eq(postFiles.tusUploadId, upload.id)),
        columns: { id: true },
      });

      if (existingByTus) {
        return null;
      }

      const pendingSlot = await tx.query.postFiles.findFirst({
        where: and(
          eq(postFiles.postId, postId),
          eq(postFiles.sortOrder, sortOrder),
          eq(postFiles.uploadStatus, PostFileUploadStatus.PENDING),
        ),
      });

      if (!pendingSlot) {
        throw new TusError(
          409,
          `No pending upload slot at sortOrder ${sortOrder} for post ${postId}`,
        );
      }

      await tx
        .update(postFiles)
        .set({
          tusUploadId: upload.id,
          mimeType: filetype,
          byteSize,
          uploadStatus,
        })
        .where(eq(postFiles.id, pendingSlot.id));

      return uploadStatus === PostFileUploadStatus.PROCESSING ? pendingSlot.id : null;
    });

    return {
      postId,
      validationJob: postFileIdForValidation
        ? { postFileId: postFileIdForValidation, tusUploadId: upload.id }
        : null,
    };
  }
}
