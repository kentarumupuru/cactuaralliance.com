import { Link } from 'react-router-dom';
import { Mascot } from '../mascot/Mascot';
import styles from './HomeIntro.module.css';

const DISCORD_URL = 'https://discord.gg/cactuar-alliance';

export function HomeIntro() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.inner} ca-container`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>FFXIV · Cactuar server</p>
          <h1 className={styles.title}>
            Big FCs.{' '}
            <span className={styles.titleAccent}>Small FCs.</span>
            <br />
            <span className={styles.titleQuiet}>One server.</span>
          </h1>
          <p className={styles.lede}>
            The Cactuar Alliance is a coalition of Free Companies that share members, mentor each
            other, and run cross-FC events. Find the FC that fits your pace, or just say hi in the
            Discord.
          </p>

          <div className={styles.ctaRow}>
            <Link to="/find-your-fc" className={styles.primary}>
              Find your FC
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.secondary}
            >
              Join the Discord
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className={styles.mascotWrap} aria-hidden="true">
          <Mascot pose="wave" size="100%" />
        </div>
      </div>
    </section>
  );
}
