import styles from '../feature/landing.module.css';

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img aria-hidden src="/window.svg" alt="" width={16} height={16} />
        Examples
      </a>
      <a
        href="https://turborepo.dev?utm_source=create-turbo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img aria-hidden src="/globe.svg" alt="" width={16} height={16} />
        Go to turborepo.dev →
      </a>
    </footer>
  );
}
