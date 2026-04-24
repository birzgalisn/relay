import { Button } from '@repo/ui/button';

import styles from '../feature/landing.module.css';

export function LandingActions() {
  return (
    <>
      <div className={styles.actions}>
        <a
          className={styles.primary}
          href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className={styles.logo}
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          Deploy now
        </a>
        <a
          href="https://turborepo.dev/docs?utm_source"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondary}
        >
          Read our docs
        </a>
      </div>

      <Button appName="web" className={styles.secondary}>
        Open alert
      </Button>
    </>
  );
}
