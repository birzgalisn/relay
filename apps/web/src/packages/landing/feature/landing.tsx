import { LandingActions } from '../ui/landing-actions';
import { LandingFooter } from '../ui/landing-footer';
import { LandingHero } from '../ui/landing-hero';
import { LandingLinks } from '../ui/landing-links';

import styles from './landing.module.css';

export function Landing() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LandingHero />
        <LandingActions />
        <LandingLinks />
      </main>
      <LandingFooter />
    </div>
  );
}
