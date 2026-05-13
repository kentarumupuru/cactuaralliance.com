import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mascot } from '../mascot/Mascot';
import styles from './Nav.module.css';

const LINKS: ReadonlyArray<{ to: string; label: string }> = [
  { to: '/', label: 'Home' },
  { to: '/find-your-fc', label: 'Find your FC' },
  { to: '/fcs', label: 'FC Directory' },
  { to: '/resources', label: 'Resources' },
];

const DISCORD_URL = 'https://discord.gg/cactuar-alliance';

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} ca-container`}>
        <NavLink to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <Mascot pose="wave" size={44} animated={false} ariaLabel="" />
          <span className={styles.brandText}>
            <span className={styles.brandPrimary}>Cactuar</span>
            <span className={styles.brandSecondary}>Alliance</span>
          </span>
        </NavLink>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="ca-primary-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>

        <nav
          id="ca-primary-nav"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
          aria-label="Primary"
        >
          <ul className={styles.list}>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.linkActive : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.discord}
                onClick={() => setMenuOpen(false)}
              >
                Discord
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className={styles.discordIcon}
                >
                  <path
                    d="M6 3h7v7M13 3 4 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
