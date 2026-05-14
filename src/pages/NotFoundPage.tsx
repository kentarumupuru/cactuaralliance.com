import { Link } from 'react-router-dom';
import { Mascot } from '../components/mascot/Mascot';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <section className={`ca-container ${styles.section}`}>
      <div className={styles.card}>
        <div className={styles.mascot} aria-hidden="true">
          <Mascot pose="sign" signText="LOST" size={240} />
        </div>

        <div className={styles.copy}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>
            This page wandered off into the <span className={styles.titleAccent}>Sagolii Desert</span>.
          </h1>
          <p className={styles.body}>
            Sabotender hasn't seen it. The link might be old, or we may have moved things around.
            Try one of these instead:
          </p>

          <div className={styles.actions}>
            <Link to="/" className={styles.primary}>
              Take me home
            </Link>
            <Link to="/fcs" className={styles.secondary}>
              Browse FCs
            </Link>
            <Link to="/find-your-fc" className={styles.secondary}>
              Find your FC
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
