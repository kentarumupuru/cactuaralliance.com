import { Link, useParams } from 'react-router-dom';
import { findFCByLodestoneId, useFC, useFCs } from '../api/ca';
import { FCProfile } from '../components/fc/FCProfile';
import { Mascot } from '../components/mascot/Mascot';
import styles from './FCProfilePage.module.css';

export default function FCProfilePage() {
  const { lodestoneId } = useParams<{ lodestoneId: string }>();

  // Two parallel queries (react-best-practices: async-parallel).
  // useFCs gives sheet metadata; useFC gives live Lodestone stats.
  const fcsQuery = useFCs();
  const liveQuery = useFC(lodestoneId);

  const fc = findFCByLodestoneId(fcsQuery.data, lodestoneId);

  // Sheet roster still loading → skeleton
  if (fcsQuery.isPending) {
    return (
      <section className={`ca-container ${styles.section}`}>
        <ProfileSkeleton />
      </section>
    );
  }

  // Sheet roster failed → can't show anything meaningful
  if (fcsQuery.isError) {
    return (
      <section className={`ca-container ${styles.section}`}>
        <div className={styles.errorBox} role="alert">
          <h1>We couldn't load the alliance roster.</h1>
          <p>
            <code>{fcsQuery.error.message}</code>
          </p>
          <Link to="/fcs" className={styles.backInline}>
            ← Back to directory
          </Link>
        </div>
      </section>
    );
  }

  // FC isn't in the alliance — 404-style page
  if (!fc) {
    return (
      <section className={`ca-container ${styles.section}`}>
        <div className={styles.notFound}>
          <Mascot pose="sign" signText="Not found" size={200} />
          <h1>That FC isn't in the alliance.</h1>
          <p>
            We couldn't find a Free Company with Lodestone ID <code>{lodestoneId}</code> in the
            Cactuar Alliance roster.
          </p>
          <Link to="/fcs" className={styles.cta}>
            Browse the full directory
          </Link>
        </div>
      </section>
    );
  }

  // FC found. Live stats are optional — 206 returns `{ lodestone: null }`.
  const live = liveQuery.data?.lodestone ?? null;
  const liveUnavailable = !liveQuery.isPending && liveQuery.data?.lodestone === null;

  return (
    <section className={`ca-container ${styles.section}`}>
      <FCProfile fc={fc} live={live} liveUnavailable={liveUnavailable} />
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <span className="ca-sr-only">Loading FC profile…</span>
      <div className={styles.skeletonHero} />
      <div className={styles.skeletonBody} />
      <div className={styles.skeletonBody} />
    </div>
  );
}
