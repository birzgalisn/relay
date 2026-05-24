import { Container, type ContainerProps } from '@mantine/core';

const FEED_MAX_WIDTH = 520;

/** Narrow centered column for feed-style list + create screens (avoid nested `<main>` inside AppShell.Main). */
export function FeedShell({ children, ...props }: ContainerProps) {
  return (
    <Container
      fluid
      maw={FEED_MAX_WIDTH}
      mx="auto"
      px={{ base: 'sm', sm: 'md' }}
      py="xl"
      {...props}
    >
      {children}
    </Container>
  );
}
