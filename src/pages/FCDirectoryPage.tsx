import { PageHero } from '../components/layout/PageHero';

export default function FCDirectoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Member Free Companies"
        title="FC Directory"
        lede="Every FC in the alliance, with live stats from the Lodestone. Filter by what you're looking for."
        mascotPose="sign"
        mascotSignText="Meet the FCs"
      />
      <section className="ca-container" style={{ paddingBlock: 'var(--sp-6) var(--sp-9)' }}>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
          The directory lands in Milestone 7.
        </p>
      </section>
    </>
  );
}
