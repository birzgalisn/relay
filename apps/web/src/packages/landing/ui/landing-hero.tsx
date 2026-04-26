import { Code, List, Stack } from '@repo/ui';

import { ThemeImage } from './theme-image';

export function LandingHero() {
  return (
    <Stack gap="lg" align="center">
      <ThemeImage
        srcLight="/turborepo-dark.svg"
        srcDark="/turborepo-light.svg"
        alt="Turborepo logo"
        width={180}
        height={38}
        style={{ objectFit: 'contain' }}
      />
      <List
        type="ordered"
        size="sm"
        fz="sm"
        lh={1.714}
        spacing="xs"
        style={{ listStylePosition: 'inside', letterSpacing: '-0.01em' }}
        styles={{ item: { fontFamily: 'var(--mantine-font-family-monospace)' } }}
        ta={{ base: 'center', sm: 'left' }}
      >
        <List.Item>
          Get started by editing{' '}
          <Code fz="inherit" fw={600}>
            apps/web/src/packages/landing/feature/landing.tsx
          </Code>
        </List.Item>
        <List.Item>Save and see your changes instantly.</List.Item>
      </List>
    </Stack>
  );
}
