import { AppShell } from '@mantine/core';
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <AppShell padding="md">
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
