import { createFileRoute } from '@tanstack/react-router';

import { CreatePostModal } from '../../packages/posts';

export const Route = createFileRoute('/posts/create')({
  component: CreatePostRoute,
});

function CreatePostRoute() {
  return <CreatePostModal />;
}
