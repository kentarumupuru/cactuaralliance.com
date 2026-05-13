import { Link } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero';

export default function HomePage() {
  return (
    <PageHero
      eyebrow="The Cactuar Alliance"
      title={
        <>
          Big FCs.{' '}
          <span style={{ color: 'var(--c-pink-500)' }}>Small FCs.</span>
          <br />
          One server.
        </>
      }
      lede="A coalition of Free Companies on the FFXIV Cactuar server. Find the FC that fits how you play, meet mentors, and join cross-FC events."
      mascotPose="wave"
    >
      <Link
        to="/find-your-fc"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.6rem',
          background: 'var(--action)',
          color: 'var(--text-on-action)',
          textDecoration: 'none',
          borderRadius: 'var(--r-pill)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '1.125rem',
          boxShadow: 'var(--shadow-pop)',
        }}
      >
        Find your FC →
      </Link>
      <Link
        to="/fcs"
        style={{
          display: 'inline-flex',
          padding: '0.85rem 1.6rem',
          background: 'var(--surface-raised)',
          color: 'var(--c-sage-700)',
          textDecoration: 'none',
          borderRadius: 'var(--r-pill)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '1.125rem',
          border: '2px solid var(--c-sage-200)',
        }}
      >
        Browse FCs
      </Link>
    </PageHero>
  );
}
