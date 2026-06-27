import { createUnionType } from '@nestjs/graphql';

import type { PostEvent } from '../interfaces/post-event.interface';
import { PostCreated } from './post-created.model';
import { PostRemoved } from './post-removed.model';

export const PostEventUnion = createUnionType({
  name: 'PostEvent',
  types: () => [PostCreated, PostRemoved] as const,
  resolveType(value: PostEvent) {
    if (value instanceof PostRemoved) {
      return PostRemoved;
    }

    return PostCreated;
  },
});
