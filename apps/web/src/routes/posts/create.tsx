import { createFileRoute } from '@tanstack/react-router';

import { CreatePostModal } from '../../packages/posts';

export const Route = createFileRoute('/posts/create')({
  component: CreatePost,
});

function CreatePost() {
  return <CreatePostModal />;
}
