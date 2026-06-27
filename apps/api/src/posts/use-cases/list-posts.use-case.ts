import { Injectable } from '@nestjs/common';
import { DrizzleService, posts } from '@repo/drizzle';

import { PaginatedIteratorFactory } from '../../infrastructure/iterator/factories/paginated-iterator.factory';
import type { UseCase } from '../../shared/interfaces/use-case.interface';
import type { ListPostsArgs } from '../interfaces/list-posts.args';
import type { PostPage } from '../models/post-page.model';
import { Post } from '../models/post.model';
import { andWherePostIsPublished } from '../util/published-post.filter';

@Injectable()
export class ListPostsUseCase implements UseCase<ListPostsArgs, PostPage> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly paginated: PaginatedIteratorFactory,
  ) {}

  execute({ pageSize, cursor }: ListPostsArgs): Promise<PostPage> {
    const iterator = this.paginated.create<Post>({
      pageSize,
      initialCursor: cursor,
      table: posts,
      fetchRows: (where, limit) =>
        this.drizzle.db.query.posts.findMany({
          limit,
          orderBy: (t, { desc: d }) => [d(t.createdAt), d(t.id)],
          where: andWherePostIsPublished(where),
          with: {
            files: {
              orderBy: (t, { asc }) => [asc(t.sortOrder)],
            },
          },
        }),
    });

    return iterator.readPage();
  }
}
