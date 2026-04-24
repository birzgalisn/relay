import { ThemeImage } from './theme-image';

import styles from '../feature/landing.module.css';

export function LandingHero() {
  return (
    <>
      <ThemeImage
        className={styles.logo}
        srcLight="/turborepo-dark.svg"
        srcDark="/turborepo-light.svg"
        alt="Turborepo logo"
        width={180}
        height={38}
      />
      <ol>
        <li>
          Get started by editing <code>apps/web/src/packages/landing/feature/Landing.tsx</code>
        </li>
        <li>Save and see your changes instantly.</li>
      </ol>
    </>
  );
}
