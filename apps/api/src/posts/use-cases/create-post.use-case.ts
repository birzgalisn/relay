import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService, PostFileUploadStatus, postFiles, posts } from '@repo/drizzle';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import type { CreatePostInput } from '../interfaces/create-post.input';
import { PostModel } from '../models/post.model';

@Injectable()
export class CreatePostUseCase implements UseCase<CreatePostInput, PostModel> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: CreatePostInput): Promise<PostModel> {
    const fileCount = Math.min(100, Math.max(0, input.fileCount ?? 0));

    const row = await this.drizzle.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(posts)
        .values({
          caption: input.caption ?? null,
        })
        .returning();

      if (!created) {
        throw new InternalServerErrorException('Failed to create post');
      }

      if (fileCount > 0) {
        await tx.insert(postFiles).values(
          Array.from({ length: fileCount }, (_, sortOrder) => ({
            postId: created.id,
            sortOrder,
            uploadStatus: PostFileUploadStatus.PENDING,
            tusUploadId: null,
          })),
        );
      }

      const full = await tx.query.posts.findFirst({
        where: eq(posts.id, created.id),
        with: {
          files: {
            orderBy: (t, { asc }) => [asc(t.sortOrder)],
          },
        },
      });

      if (!full) {
        throw new InternalServerErrorException('Failed to load created post');
      }

      return full;
    });

    return row;
  }
}
