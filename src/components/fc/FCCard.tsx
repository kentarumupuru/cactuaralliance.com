import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useFC } from '../../api/ca';
import { ACTIVITY_LABELS, PLAYSTYLE_LABELS } from '../../fc/labels';
import type { FC } from '../../types';
import { FCCrest } from './FCCrest';
import styles from './FCCard.module.css';

interface FCCardProps {
  fc: FC;
}

/**
 * One FC tile in the directory grid. Pulls live crest + member count from
 * the proxy via useFC(); falls back to a placeholder crest when Lodestone
 * is unavailable (the hook still returns 200/206 from the proxy).
 */
export const FCCard = memo(function FCCard({ fc }: FCCardProps) {
  const { data: live } = useFC(fc.lodestoneId);
  const crestUrls = live?.lodestone?.crestUrls ?? [];
  const memberCount = live?.lodestone?.memberCount;

  return (
    <article className={styles.card}>
      {fc.featured && <span className={styles.featuredBadge}>Featured</span>}

      <div className={styles.header}>
        <FCCrest urls={crestUrls} fallbackLabel={fc.tag || fc.name} size={68} />
        <div className={styles.identity}>
          <h3 className={styles.name}>
            <Link to={`/fcs/${fc.lodestoneId}`} className={styles.nameLink}>
              {fc.name}
            </Link>
          </h3>
          {fc.tag && <p className={styles.tag}>«{fc.tag}»</p>}
        </div>
      </div>

      <p className={styles.blurb}>{fc.blurb}</p>

      <ul className={styles.tags}>
        <li className={`${styles.tagChip} ${styles[`playstyle_${fc.playstyle}`]}`}>
          {PLAYSTYLE_LABELS[fc.playstyle]}
        </li>
        {fc.activities.slice(0, 3).map((activity) => (
          <li key={activity} className={styles.tagChip}>
            {ACTIVITY_LABELS[activity]}
          </li>
        ))}
        {fc.activities.length > 3 && (
          <li className={`${styles.tagChip} ${styles.tagChipMore}`}>
            +{fc.activities.length - 3}
          </li>
        )}
      </ul>

      <footer className={styles.footer}>
        <span className={styles.meta}>
          {typeof memberCount === 'number' ? (
            <>
              <strong>{memberCount}</strong> member{memberCount === 1 ? '' : 's'}
            </>
          ) : (
            <span className={styles.metaPlaceholder}>· live stats loading</span>
          )}
        </span>
        <span className={fc.recruiting ? styles.recruitingYes : styles.recruitingNo}>
          {fc.recruiting ? 'Recruiting' : 'Closed'}
        </span>
      </footer>
    </article>
  );
});
