import type { Link } from '@repo/api';

import styles from './link-card.module.css';

export type LinkCardProps = {
  link: Link;
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
