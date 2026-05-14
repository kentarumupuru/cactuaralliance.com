import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFC, useFCs } from '../../api/ca';
import { FCCrest } from '../fc/FCCrest';
import { ACTIVITY_LABELS, PLAYSTYLE_LABELS } from '../../fc/labels';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { FC } from '../../types';
import styles from './FeaturedFCs.module.css';

const ROTATION_MS = 7000;

export function FeaturedFCs() {
  const { data, isPending, isError } = useFCs();
  const reducedMotion = useReducedMotion();

  const featured = useMemo<FC[]>(
    () => (data?.fcs.filter((fc) => fc.featured) ?? []).slice(0, 6),
    [data],
  );

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Wrap-safe advancer (react-best-practices: rerender-functional-setstate)
  const advance = useCallback(() => {
    setActive((i) => (featured.length === 0 ? 0 : (i + 1) % featured.length));
  }, [featured.length]);

  useEffect(() => {
    if (reducedMotion || paused || featured.length <= 1) return;
    const id = window.setInterval(advance, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [advance, paused, reducedMotion, featured.length]);

  // Keep active index in bounds if data updates and trims the list
  useEffect(() => {
    if (active >= featured.length && featured.length > 0) setActive(0);
  }, [active, featured.length]);

  if (isPending) {
    return <CarouselSkeleton />;
  }

  if (isError || featured.length === 0) {
    // Hide the section entirely rather than show an error — the rest of the
    // home page is still useful without featured FCs.
    return null;
  }

  return (
    <section
      className={styles.section}
      aria-roledescription="carousel"
      aria-label="Featured Free Companies"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <header className={styles.header}>
        <p className={styles.kicker}>Featured this week</p>
        <h2 className={styles.title}>Free Companies you should meet</h2>
      </header>

      <div className={styles.stage}>
        {featured.map((fc, i) => (
          <FeaturedSlide
            key={fc.lodestoneId}
            fc={fc}
            isActive={i === active}
            position={i === active ? 0 : i < active ? -1 : 1}
          />
        ))}
      </div>

      <div className={styles.controls}>
        <ol className={styles.dots} role="tablist" aria-label="Featured FC slides">
          {featured.map((fc, i) => (
            <li key={fc.lodestoneId}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${fc.name}`}
                onClick={() => setActive(i)}
                className={`${styles.dot} ${i === active ? styles.dotOn : ''}`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

interface FeaturedSlideProps {
  fc: FC;
  isActive: boolean;
  position: number; // -1 = previous, 0 = active, 1 = next
}

function FeaturedSlide({ fc, isActive, position }: FeaturedSlideProps) {
  const { data: live } = useFC(isActive ? fc.lodestoneId : undefined);
  const crestUrls = live?.lodestone?.crestUrls ?? [];

  return (
    <article
      className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
      style={{ '--slide-pos': position } as React.CSSProperties}
      aria-hidden={!isActive}
      {...(isActive ? {} : { inert: '' })}
    >
      <div className={styles.slideCrest}>
        <FCCrest urls={crestUrls} fallbackLabel={fc.tag || fc.name} size={160} />
      </div>
      <div className={styles.slideCopy}>
        <p className={styles.slideTag}>«{fc.tag || fc.name}»</p>
        <h3 className={styles.slideName}>
          <Link to={`/fcs/${fc.lodestoneId}`}>{fc.name}</Link>
        </h3>
        <p className={styles.slideBlurb}>{fc.blurb}</p>
        <ul className={styles.slideTags}>
          <li className={`${styles.slideChip} ${styles[`slideChip_${fc.playstyle}`]}`}>
            {PLAYSTYLE_LABELS[fc.playstyle]}
          </li>
          {fc.activities.slice(0, 3).map((a) => (
            <li key={a} className={styles.slideChip}>
              {ACTIVITY_LABELS[a]}
            </li>
          ))}
        </ul>
        <Link to={`/fcs/${fc.lodestoneId}`} className={styles.slideCta}>
          See their profile →
        </Link>
      </div>
    </article>
  );
}

function CarouselSkeleton() {
  return (
    <section className={styles.section} aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.skeleton} />
      </div>
    </section>
  );
}
