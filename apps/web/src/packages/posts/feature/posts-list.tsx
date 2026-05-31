import { useQuery } from '@apollo/client/react';
import {
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { useCallback } from 'react';

import { PostFileUploadStatus } from '../../../_generated/graphql-types';
import { FeedShell } from '../../../shared/ui/feed-shell';
import { MediaGrid } from '../../../shared/ui/media-grid';
import { useInfiniteScroll } from '../../../shared/util/use-infinite-scroll';
import { PostsDocument } from '../data-access/posts.generated';

export function PostsList() {
  const { data, loading, error, fetchMore } = useQuery(PostsDocument, {
    variables: { cursor: null },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const page = data?.posts;
  const posts = page?.nodes ?? [];
  const hasNextPage = page?.hasNextPage ?? false;
  const nextCursor = page?.nextCursor;
  const loadingMore = loading && data != null;

  const loadMore = useCallback(() => {
    if (!hasNextPage || nextCursor == null || loadingMore) {
      return;
    }

    void fetchMore({
      variables: { cursor: nextCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult?.posts == null) {
          return prev;
        }

        return {
          posts: {
            ...fetchMoreResult.posts,
            nodes: [...prev.posts.nodes, ...fetchMoreResult.posts.nodes],
          },
        };
      },
    });
  }, [fetchMore, hasNextPage, loadingMore, nextCursor]);

  useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loadingMore,
    onLoadMore: loadMore,
  });

  if (loading && !data) {
    return (
      <FeedShell>
        <Center py="xl">
          <Loader />
        </Center>
      </FeedShell>
    );
  }

  if (error && !data) {
    return (
      <FeedShell>
        <Text c="red">{error.message}</Text>
      </FeedShell>
    );
  }

  return (
    <FeedShell>
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="nowrap" gap="md">
          <Title order={2}>Posts</Title>
          <Link to="/posts/create" resetScroll={false}>
            <Button component="span" variant="light" size="compact-sm">
              New post
            </Button>
          </Link>
        </Group>

        <Stack gap="lg" pb="md">
          {posts.length === 0 ? (
            <Text c="dimmed">
              No posts yet.{' '}
              <Anchor component={Link} to="/posts/create" resetScroll={false}>
                Create one
              </Anchor>
              .
            </Text>
          ) : (
            posts.map((post) => {
              const sortedFiles = post.files.slice().sort((a, b) => a.sortOrder - b.sortOrder);
              const caption = post.caption?.trim() || 'Untitled';
              return (
                <Card
                  key={post.id}
                  withBorder
                  padding={0}
                  radius="md"
                  shadow="sm"
                  style={{ overflow: 'hidden' }}
                >
                  <Stack gap={0}>
                    <Box px="md" pt="md" pb="sm">
                      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
                        <Text fw={600}>{caption}</Text>
                        <Link
                          to="/posts/delete/$postId"
                          params={{ postId: post.id }}
                          resetScroll={false}
                        >
                          <Button component="span" variant="light" color="red" size="compact-sm">
                            Delete
                          </Button>
                        </Link>
                      </Group>
                      <Text size="xs" c="dimmed" mt={6}>
                        {new Date(post.createdAt).toLocaleString()}
                      </Text>
                    </Box>
                    {sortedFiles.length > 0 ? (
                      <MediaGrid
                        flush
                        items={sortedFiles.map((file) => ({
                          key: file.id,
                          src: file.url ?? '',
                          alt: caption,
                          blurWhileProcessing:
                            file.uploadStatus === PostFileUploadStatus.Processing,
                          emptyLabel:
                            file.uploadStatus === PostFileUploadStatus.Pending
                              ? 'Uploading...'
                              : file.uploadStatus === PostFileUploadStatus.Processing
                                ? 'Checking image...'
                                : file.uploadStatus === PostFileUploadStatus.Failed
                                  ? 'Removed'
                                  : undefined,
                        }))}
                      />
                    ) : (
                      <Text size="sm" c="dimmed" px="md" pb="md">
                        No files
                      </Text>
                    )}
                  </Stack>
                </Card>
              );
            })
          )}
          {loadingMore ? (
            <Center py="md">
              <Loader size="sm" />
            </Center>
          ) : null}
        </Stack>
      </Stack>
    </FeedShell>
  );
}
