import { createFileRoute, Outlet } from '@tanstack/react-router';

import { PostsList } from '../../packages/posts';

export const Route = createFileRoute('/posts')({
  component: Posts,
});

function Posts() {
  return (
    <>
      <PostsList />
      <Outlet />
    </>
  );
}
