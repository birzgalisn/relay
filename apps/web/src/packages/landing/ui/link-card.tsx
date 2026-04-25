import type { LandingLinksQuery } from '../data-access/landing-links.generated';

import styles from './link-card.module.css';

export type LandingLink = NonNullable<NonNullable<LandingLinksQuery['links']>[number]>;

export type LinkCardProps = {
  link: LandingLink;
  className?: string;
};

export function LinkCard({ link, className }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={link.description}
      className={[styles.card, className].filter(Boolean).join(' ')}
    >
      {link.title}
    </a>
  );
}
