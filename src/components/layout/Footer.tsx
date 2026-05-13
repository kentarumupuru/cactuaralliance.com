import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();
const DISCORD_URL = 'https://discord.gg/cactuar-alliance';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} ca-container`}>
        <div className={styles.colBrand}>
          <p className={styles.tagline}>
            Big FCs. Small FCs. <span className={styles.taglineAccent}>One server.</span>
          </p>
          <p className={styles.note}>
            An unofficial player-run coalition on the FFXIV Cactuar server.
            <br />
            Final Fantasy XIV © SQUARE ENIX CO., LTD.
          </p>
        </div>

        <div className={styles.colLinks}>
          <h2 className={styles.colHeading}>The Alliance</h2>
          <ul>
            <li>
              <Link to="/find-your-fc">Find your FC</Link>
            </li>
            <li>
              <Link to="/fcs">FC Directory</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
          </ul>
        </div>

        <div className={styles.colLinks}>
          <h2 className={styles.colHeading}>Connect</h2>
          <ul>
            <li>
              <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                Discord ↗
              </a>
            </li>
            <li>
              <a
                href="https://na.finalfantasyxiv.com/lodestone/worldstatus/"
                target="_blank"
                rel="noreferrer"
              >
                Server Status ↗
              </a>
            </li>
            <li>
              <a
                href="https://na.finalfantasyxiv.com/lodestone/freecompany/"
                target="_blank"
                rel="noreferrer"
              >
                Lodestone ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`${styles.bottom} ca-container`}>
        <p>© {YEAR} Cactuar Alliance — community-built, community-loved.</p>
      </div>
    </footer>
  );
}
