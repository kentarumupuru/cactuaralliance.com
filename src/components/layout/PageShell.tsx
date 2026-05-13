import type { ReactNode } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import styles from './PageShell.module.css';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className={styles.shell}>
      <Nav />
      <main id="main" className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
