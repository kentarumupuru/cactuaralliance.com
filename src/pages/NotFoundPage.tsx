import { Link } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero';

export default function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="This page wandered off"
        lede="Sabotender hasn't seen it. Try heading back to the home page or browsing the FC directory."
        mascotPose="sign"
        mascotSignText="LOST"
      />
      <section
        className="ca-container"
        style={{
          paddingBlock: 'var(--sp-5) var(--sp-9)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--sp-3)',
        }}
      >
        <Link
          to="/"
          style={{
            padding: '0.75rem 1.4rem',
            background: 'var(--action)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
          }}
        >
          Take me home
        </Link>
        <Link
          to="/fcs"
          style={{
            padding: '0.75rem 1.4rem',
            background: 'var(--surface-raised)',
            color: 'var(--c-sage-700)',
            border: '2px solid var(--c-sage-200)',
            textDecoration: 'none',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
          }}
        >
          Browse FCs
        </Link>
      </section>
    </>
  );
}
