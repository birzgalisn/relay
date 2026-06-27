import { createUnionType } from '@nestjs/graphql';

import { PostFeedCreatedModel } from './post-feed-created.model';
import { PostFeedRemovedModel } from './post-feed-removed.model';

export type PostFeedEventModel = PostFeedCreatedModel | PostFeedRemovedModel;

export const PostFeedEventUnion = createUnionType({
  name: 'PostFeedEvent',
  types: () => [PostFeedCreatedModel, PostFeedRemovedModel] as const,
  resolveType(value: PostFeedEventModel) {
    if (value instanceof PostFeedRemovedModel) {
      return PostFeedRemovedModel;
    }

    return PostFeedCreatedModel;
  },
});
