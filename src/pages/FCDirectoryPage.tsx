import { useMemo, useState } from 'react';
import { PageHero } from '../components/layout/PageHero';
import { FCCard } from '../components/fc/FCCard';
import { FCFilters } from '../components/fc/FCFilters';
import { Mascot } from '../components/mascot/Mascot';
import { useFCs } from '../api/ca';
import { applyFCFilters, EMPTY_FILTERS, type FCFilters as FCFiltersType } from '../fc/filters';
import styles from './FCDirectoryPage.module.css';

export default function FCDirectoryPage() {
  const { data, isPending, isError, error } = useFCs();
  const [filters, setFilters] = useState<FCFiltersType>({
    ...EMPTY_FILTERS,
    sortByFeatured: true,
  });

  // react-best-practices: rerender-memo — keep filtered list memoized
  const filtered = useMemo(
    () => (data ? applyFCFilters(data.fcs, filters) : []),
    [data, filters],
  );

  return (
    <>
      <PageHero
        eyebrow="Member Free Companies"
        title="FC Directory"
        lede="Every FC in the alliance with live crest, member count, and recruiting status pulled fresh from the Lodestone."
        mascotPose="sign"
        mascotSignText="Meet the FCs"
      />

      <section className={`ca-container ${styles.section}`}>
        {isPending && <DirectorySkeleton />}

        {isError && (
          <div className={styles.errorBox} role="alert">
            <h2>The directory's down a Cactuar hole.</h2>
            <p>
              Could not reach the proxy: <code>{error.message}</code>
            </p>
            <p className={styles.errorHint}>
              If you're running this locally, start the worker with
              <code> cd ca-proxy &amp;&amp; npm run dev</code>.
            </p>
          </div>
        )}

        {data && (
          <>
            <FCFilters
              filters={filters}
              onChange={setFilters}
              totalCount={data.fcs.length}
              filteredCount={filtered.length}
            />

            {filtered.length > 0 ? (
              <ul className={styles.grid}>
                {filtered.map((fc) => (
                  <li key={fc.lodestoneId} className={styles.gridItem}>
                    <FCCard fc={fc} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <Mascot pose="sign" signText="No matches" size={180} />
                <h2>No FCs match these filters.</h2>
                <p>Try clearing a filter or two.</p>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function DirectorySkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <span className="ca-sr-only">Loading FC directory…</span>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );
}
