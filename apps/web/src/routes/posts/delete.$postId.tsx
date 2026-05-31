import { createFileRoute } from '@tanstack/react-router';

import { apolloClient } from '../../apollo-client';
import { DeletePostModal } from '../../packages/posts';
import { PostDocument } from '../../packages/posts/data-access/posts.generated';

export const Route = createFileRoute('/posts/delete/$postId')({
  pendingMs: 0,
  loader: async ({ params }) => {
    const { data } = await apolloClient.query({
      query: PostDocument,
      variables: { id: params.postId },
      fetchPolicy: 'cache-first',
    });
    return { post: data?.post ?? null };
  },
  pendingComponent: DeletePostPending,
  component: DeletePostRoute,
});

function DeletePostPending() {
  return <DeletePostModal pending />;
}

function DeletePostRoute() {
  const { post } = Route.useLoaderData();

  return <DeletePostModal post={post} />;
}
