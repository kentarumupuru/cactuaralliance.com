import type { ReactNode } from 'react';
import { Mascot, type MascotPose } from '../mascot/Mascot';
import styles from './PageHero.module.css';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  mascotPose?: MascotPose;
  mascotSignText?: string;
  hideMascot?: boolean;
  children?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  lede,
  mascotPose = 'wave',
  mascotSignText,
  hideMascot = false,
  children,
}: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.inner} ca-container`}>
        <div className={styles.copy}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {lede && <p className={styles.lede}>{lede}</p>}
          {children && <div className={styles.actions}>{children}</div>}
        </div>
        {!hideMascot && (
          <div className={styles.mascot} aria-hidden="true">
            <Mascot pose={mascotPose} signText={mascotSignText} size="100%" />
          </div>
        )}
      </div>
    </section>
  );
}
