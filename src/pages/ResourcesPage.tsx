import { PageHero } from '../components/layout/PageHero';

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Guides, links, mentorship"
        title="Resources"
        lede="Hand-picked starting points for new players, returning players, and veterans. Plus mentorship — find someone who's already done what you want to learn."
        mascotPose="sign"
        mascotSignText="Welcome!"
      />
      <section className="ca-container" style={{ paddingBlock: 'var(--sp-6) var(--sp-9)' }}>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
          The resource grid lands in Milestone 10.
        </p>
      </section>
    </>
  );
}
