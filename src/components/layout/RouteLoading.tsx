import styles from './RouteLoading.module.css';

export function RouteLoading() {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className="ca-sr-only">Loading…</span>
      <div className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
