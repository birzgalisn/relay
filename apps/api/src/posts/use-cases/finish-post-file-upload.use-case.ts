import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService, PostFileUploadStatus, postFiles, posts } from '@repo/drizzle';
import { and, eq, max } from 'drizzle-orm';
import { z } from 'zod';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import type {
  TusUpload,
  TusUploadResult,
} from '../../infrastructure/tus/interfaces/tus-upload-handler.interface';

const tusUploadMetadataSchema = z.object({
  postId: z.uuid(),
  /** Tus metadata values are strings (e.g. `"0"`); `sortOrder` is 0-based from the client. */
  sortOrder: z.coerce.number().int().min(0).optional(),
});

@Injectable()
export class FinishPostFileUploadUseCase implements UseCase<TusUpload, TusUploadResult> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(upload: TusUpload): Promise<TusUploadResult> {
    const parsed = tusUploadMetadataSchema.safeParse(upload.metadata);

    if (!parsed.success) {
      return { handled: false };
    }

    const { postId, sortOrder: sortOrderFromMeta } = parsed.data;

    await this.drizzle.db.transaction(async (tx) => {
      const post = await tx.query.posts.findFirst({
        where: eq(posts.id, postId),
        columns: { id: true },
      });

      if (!post) {
        throw new NotFoundException(`Post ${postId} not found`);
      }

      const existingByTus = await tx.query.postFiles.findFirst({
        where: and(eq(postFiles.postId, postId), eq(postFiles.tusUploadId, upload.id)),
        columns: { id: true },
      });

      if (existingByTus) {
        return;
      }

      const mimeTypeRaw = upload.metadata?.filetype ?? upload.metadata?.contentType ?? null;
      const mimeType = mimeTypeRaw === '' ? null : mimeTypeRaw;
      const byteSize = upload.size ?? null;

      const readyPatch = {
        tusUploadId: upload.id,
        mimeType,
        byteSize,
        uploadStatus: PostFileUploadStatus.READY,
      };

      if (sortOrderFromMeta !== undefined) {
        const pendingSlot = await tx.query.postFiles.findFirst({
          where: and(
            eq(postFiles.postId, postId),
            eq(postFiles.sortOrder, sortOrderFromMeta),
            eq(postFiles.uploadStatus, PostFileUploadStatus.PENDING),
          ),
        });

        if (pendingSlot) {
          await tx.update(postFiles).set(readyPatch).where(eq(postFiles.id, pendingSlot.id));
          return;
        }

        const atSlot = await tx.query.postFiles.findFirst({
          where: and(eq(postFiles.postId, postId), eq(postFiles.sortOrder, sortOrderFromMeta)),
        });

        if (!atSlot) {
          await tx.insert(postFiles).values({
            postId,
            tusUploadId: upload.id,
            sortOrder: sortOrderFromMeta,
            mimeType,
            byteSize,
            uploadStatus: PostFileUploadStatus.READY,
          });
          return;
        }

        if (atSlot.tusUploadId == null) {
          await tx.update(postFiles).set(readyPatch).where(eq(postFiles.id, atSlot.id));
          return;
        }
      }

      const [agg] = await tx
        .select({ max: max(postFiles.sortOrder) })
        .from(postFiles)
        .where(eq(postFiles.postId, postId));

      const sortOrder = (agg?.max ?? -1) + 1;

      await tx.insert(postFiles).values({
        postId,
        tusUploadId: upload.id,
        sortOrder,
        mimeType,
        byteSize,
        uploadStatus: PostFileUploadStatus.READY,
      });
    });

    return { handled: true };
  }
}
