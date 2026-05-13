import { PageHero } from '../components/layout/PageHero';
import { useFCs } from '../api/ca';

export default function FCDirectoryPage() {
  const { data, isPending, isError, error } = useFCs();

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
        {isPending && (
          <p style={{ color: 'var(--text-muted)' }}>Loading FCs from the proxy…</p>
        )}
        {isError && (
          <p style={{ color: 'var(--c-pink-700)' }}>
            Could not load FCs from the proxy: {error.message}.{' '}
            <em>Is wrangler dev running on :8787?</em>
          </p>
        )}
        {data && (
          <>
            <p style={{ marginBottom: 'var(--sp-4)', color: 'var(--text-muted)' }}>
              {data.fcs.length} FC{data.fcs.length === 1 ? '' : 's'} · fetched at{' '}
              {new Date(data.fetchedAt).toLocaleTimeString()}
            </p>
            <ul
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--sp-4)',
              }}
            >
              {data.fcs.map((fc) => (
                <li
                  key={fc.lodestoneId}
                  style={{
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: 'var(--r-md)',
                    padding: 'var(--sp-4)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <h3 style={{ color: 'var(--c-sage-700)' }}>
                    {fc.name}{' '}
                    <small style={{ color: 'var(--c-pink-500)', fontSize: '0.75em' }}>
                      [{fc.tag}]
                    </small>
                  </h3>
                  <p style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--fs-14)' }}>{fc.blurb}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 'var(--sp-6)' }}>
          The full directory with filters lands in Milestone 7.
        </p>
      </section>
    </>
  );
}
