import { Injectable } from '@nestjs/common';
import { DrizzleService, posts } from '@repo/drizzle';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import { PostModel } from '../models/post.model';
import { isPublishedPost } from '../util/published-post.filter';

@Injectable()
export class GetPostUseCase implements UseCase<string, PostModel | null> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(id: string): Promise<PostModel | null> {
    const row = await this.drizzle.db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        files: {
          orderBy: (t, { asc }) => [asc(t.sortOrder)],
        },
      },
    });

    if (!row || !isPublishedPost(row.status)) {
      return null;
    }

    return row;
  }
}
