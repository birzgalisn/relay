import type { SubscribeToMoreUpdateQueryFn } from '@apollo/client';

import type {
  PostFragment,
  PostsFeedSubscription,
  PostsQuery,
  PostsQueryVariables,
} from '../data-access/posts.generated';

export const updatePostsFromFeedEvent: SubscribeToMoreUpdateQueryFn<
  PostsQuery,
  PostsQueryVariables,
  PostsFeedSubscription
> = (_prev, options) => {
  if (!options.complete) {
    return;
  }

  const { posts: page } = options.previousData;
  const event = options.subscriptionData.data.postsFeed;

  if (event.__typename === 'PostCreated') {
    const post = {
      ...event,
      __typename: 'Post',
    } satisfies PostFragment;

    return {
      posts: {
        ...page,
        nodes: [post, ...page.nodes.filter((node) => node.id !== post.id)],
      },
    } as const satisfies PostsQuery;
  }

  return {
    posts: {
      ...page,
      nodes: page.nodes.filter((node) => node.id !== event.id),
    },
  } as const satisfies PostsQuery;
};
