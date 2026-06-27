import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useCallback, useEffect, useEffectEvent } from 'react';

import { POSTS_LIST_VARIABLES } from '../constants';
import { PostsDocument, PostsFeedDocument } from '../data-access/posts.generated';
import { updatePostsFromFeedEvent } from '../util/update-posts-from-feed-event';

export function usePostsFeed() {
  const { data, loading, error, fetchMore, networkStatus, subscribeToMore } = useQuery(
    PostsDocument,
    { variables: POSTS_LIST_VARIABLES },
  );

  const page = data?.posts;
  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  const loadMore = useCallback(() => {
    if (!page?.hasNextPage || page?.nextCursor == null || loadingMore) {
      return;
    }
    void fetchMore({ variables: { cursor: page.nextCursor } });
  }, [fetchMore, loadingMore, page]);

  const subscribeToFeed = useEffectEvent(() => {
    return subscribeToMore({
      document: PostsFeedDocument,
      variables: { pageSize: POSTS_LIST_VARIABLES.pageSize },
      updateQuery: updatePostsFromFeedEvent,
    });
  });

  useEffect(() => {
    subscribeToFeed();
  }, []);

  return {
    page,
    loading: loading && !data,
    error,
    loadMore,
    loadingMore,
  } as const;
}
