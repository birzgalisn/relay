import { Injectable } from '@nestjs/common';
import { DrizzleService, posts } from '@repo/drizzle';

import { PaginatedIteratorFactory } from '../../infrastructure/iterator/paginated-iterator.factory';
import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import type { ListPostsArgs } from '../interfaces/list-posts.args';
import { PostPageModel } from '../models/post-page.model';
import { PostModel } from '../models/post.model';

@Injectable()
export class ListPostsUseCase implements UseCase<ListPostsArgs, PostPageModel> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly paginated: PaginatedIteratorFactory,
  ) {}

  execute({ pageSize, cursor }: ListPostsArgs): Promise<PostPageModel> {
    const iterator = this.paginated.create<PostModel>({
      pageSize,
      initialCursor: cursor,
      table: posts,
      fetchRows: (where, limit) =>
        this.drizzle.db.query.posts.findMany({
          limit,
          orderBy: (t, { desc: d }) => [d(t.createdAt), d(t.id)],
          where,
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
