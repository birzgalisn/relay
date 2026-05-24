import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RedirectToPosts,
});

function RedirectToPosts() {
  return <Navigate to="/posts" />;
}
