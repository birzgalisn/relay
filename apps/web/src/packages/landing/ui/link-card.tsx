import { Button } from '@repo/ui';

import type { LandingLinksQuery } from '../data-access/landing-links.generated';

export type LandingLink = NonNullable<NonNullable<LandingLinksQuery['links']>[number]>;

export type LinkCardProps = {
  link: LandingLink;
};

export function LinkCard({ link }: LinkCardProps) {
  return (
    <Button
      component="a"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={link.description}
      variant="default"
      radius={9999}
      h={{ base: 40, sm: 48 }}
      miw={{ sm: 180 }}
      fz={{ base: 'sm', sm: 'md' }}
    >
      {link.title}
    </Button>
  );
}
