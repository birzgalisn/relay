import { Stack } from '@repo/ui';

import { LandingActions } from '../ui/landing-actions';
import { LandingFooter } from '../ui/landing-footer';
import { LandingHero } from '../ui/landing-hero';
import { LandingLinks } from '../ui/landing-links';

export function Landing() {
  return (
    <Stack
      mih="100svh"
      px={{ base: 32, sm: 80 }}
      pt={20}
      pb={{ base: 80, sm: 20 }}
      gap={64}
      align="stretch"
    >
      <Stack flex={1} justify="center" align="center" gap={32}>
        <LandingHero />
        <LandingActions />
        <LandingLinks />
      </Stack>
      <LandingFooter />
    </Stack>
  );
}
