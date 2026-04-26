import { Anchor, Group, Image } from '@repo/ui';

export function LandingFooter() {
  return (
    <Group gap="lg" justify="center" wrap="wrap">
      <Anchor
        href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        c="inherit"
      >
        <Group gap="xs" wrap="nowrap">
          <Image src="/window.svg" alt="" w={16} h={16} aria-hidden style={{ flexShrink: 0 }} />
          Examples
        </Group>
      </Anchor>
      <Anchor
        href="https://turborepo.dev?utm_source=create-turbo"
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        c="inherit"
      >
        <Group gap="xs" wrap="nowrap">
          <Image src="/globe.svg" alt="" w={16} h={16} aria-hidden style={{ flexShrink: 0 }} />
          Go to turborepo.dev →
        </Group>
      </Anchor>
    </Group>
  );
}
