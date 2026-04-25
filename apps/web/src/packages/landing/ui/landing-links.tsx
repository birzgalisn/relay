import { isInstanceOfError } from '../../../shared/util/is-instance-of-error';
import { useLandingLinks } from '../util/use-landing-links';
import { LinkCard } from './link-card';

import styles from '../feature/landing.module.css';

export function LandingLinks() {
  const { graphqlEndpoint, links, isPending, isError, error, hasLinks } = useLandingLinks();

  if (isPending) {
    return <div className={styles.muted}>Loading links...</div>;
  }

  if (isError) {
    return (
      <div className={styles.muted}>
        Could not load links from {graphqlEndpoint}.{' '}
        {isInstanceOfError(error) ? error.message : 'Unable to load links.'}
      </div>
    );
  }

  if (hasLinks) {
    return (
      <div className={styles.actions}>
        {links.map((link) => (
          <LinkCard key={link.id} link={link} className={styles.secondary} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.muted}>
      No links available. Make sure the NestJS API is running ({graphqlEndpoint}).
    </div>
  );
}
