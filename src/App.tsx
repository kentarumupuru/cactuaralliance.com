import styles from './App.module.css';

export default function App() {
  return (
    <main className={styles.shell}>
      <div className="ca-container">
        <p className={styles.kicker}>Milestone 2 · Design tokens</p>
        <h1 className={styles.title}>
          The Cactuar Alliance
          <span className={styles.titleAccent}>where Free Companies grow together</span>
        </h1>
        <p className={styles.lede}>
          A coalition of FCs on the Cactuar server — find your people, learn from mentors, and join
          cross-FC events.
        </p>

        <section aria-label="Design token preview" className={styles.swatches}>
          <Swatch label="Sage 300" varName="--c-sage-300" />
          <Swatch label="Sage 600" varName="--c-sage-600" />
          <Swatch label="Sand 200" varName="--c-sand-200" />
          <Swatch label="Pink 500" varName="--c-pink-500" />
          <Swatch label="Sky 300" varName="--c-sky-300" />
          <Swatch label="Ink 900" varName="--c-ink-900" />
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.cta}>
            Find your FC
          </button>
          <button type="button" className={styles.ghost}>
            Join the Discord
          </button>
        </div>
      </div>
    </main>
  );
}

function Swatch({ label, varName }: { label: string; varName: string }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.chip} style={{ background: `var(${varName})` }} />
      <span>{label}</span>
      <code>{varName}</code>
    </div>
  );
}
