import { PageHero } from '../components/layout/PageHero';

export default function FindYourFCPage() {
  return (
    <>
      <PageHero
        eyebrow="Four quick questions"
        title="Find your FC"
        lede="Tell us how you play, when you play, and what you enjoy — we'll match you with FCs from the alliance."
        mascotPose="think"
      />
      <section className="ca-container" style={{ paddingBlock: 'var(--sp-6) var(--sp-9)' }}>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
          The wizard arrives in Milestone 9.
        </p>
      </section>
    </>
  );
}
