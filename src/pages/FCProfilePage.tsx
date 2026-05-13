import { useParams, Link } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero';

export default function FCProfilePage() {
  const { lodestoneId } = useParams<{ lodestoneId: string }>();
  return (
    <>
      <PageHero
        eyebrow={`Lodestone ID: ${lodestoneId ?? 'unknown'}`}
        title="FC Profile"
        lede="Live stats from Lodestone, plus the FC's blurb, mentorship offerings, and Discord."
        mascotPose="sign"
        mascotSignText="Coming soon"
      />
      <section className="ca-container" style={{ paddingBlock: 'var(--sp-6) var(--sp-9)' }}>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
          The profile page lands in Milestone 8.
        </p>
        <p>
          <Link to="/fcs">← Back to directory</Link>
        </p>
      </section>
    </>
  );
}
