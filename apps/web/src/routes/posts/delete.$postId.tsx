import { createFileRoute } from '@tanstack/react-router';

import { apolloClient } from '../../apollo';
import { DeletePostModal } from '../../packages/posts';
import { PostDocument } from '../../packages/posts/data-access/posts.generated';

export const Route = createFileRoute('/posts/delete/$postId')({
  loader: async ({ params }) => {
    const { data } = await apolloClient.query({
      query: PostDocument,
      variables: { id: params.postId },
    });
    return { post: data?.post };
  },
  pendingComponent: DeletePostPending,
  component: DeletePost,
});

function DeletePostPending() {
  return <DeletePostModal pending />;
}

function DeletePost() {
  const { post } = Route.useLoaderData();

  return <DeletePostModal post={post} />;
}
