import { Injectable } from '@nestjs/common';
import { DrizzleService, postFiles, posts, PostStatus } from '@repo/drizzle';
import { AppError, type CreatePostInput } from '@repo/shared';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../shared/interfaces/use-case.interface';
import { Post } from '../models/post.model';

@Injectable()
export class CreatePostUseCase implements UseCase<CreatePostInput, Post> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: CreatePostInput): Promise<Post> {
    const row = await this.drizzle.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(posts)
        .values({
          caption: input.caption ?? null,
          status: PostStatus.PUBLISHING,
        })
        .returning();

      if (!created) {
        throw AppError.internal('Failed to create post');
      }

      if (input.files > 0) {
        await tx.insert(postFiles).values(
          Array.from({ length: input.files }, (_, sortOrder) => ({
            postId: created.id,
            sortOrder,
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
        throw AppError.internal('Failed to load created post');
      }

      return full;
    });

    return row;
  }
}
