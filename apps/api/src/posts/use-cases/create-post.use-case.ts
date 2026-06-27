import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService, postFiles, PostFileUploadStatus, posts, PostStatus } from '@repo/drizzle';
import type { CreatePostInput } from '@repo/shared';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import { PostModel } from '../models/post.model';

@Injectable()
export class CreatePostUseCase implements UseCase<CreatePostInput, PostModel> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: CreatePostInput): Promise<PostModel> {
    const row = await this.drizzle.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(posts)
        .values({
          caption: input.caption ?? null,
          status: PostStatus.PUBLISHING,
        })
        .returning();

      if (!created) {
        throw new InternalServerErrorException('Failed to create post');
      }

      if (input.fileCount > 0) {
        await tx.insert(postFiles).values(
          Array.from({ length: input.fileCount }, (_, sortOrder) => ({
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
