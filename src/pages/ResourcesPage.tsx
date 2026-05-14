import { Link } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero';
import { Mascot } from '../components/mascot/Mascot';
import { RESOURCE_SECTIONS, type ResourceLink } from '../data/resources';
import styles from './ResourcesPage.module.css';

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Guides · Tools · Mentorship"
        title="Resources"
        lede="Hand-picked starting points for sprouts, returning players, and veterans. Plus pointers for mentorship inside the alliance Discord."
        mascotPose="sign"
        mascotSignText="Read these!"
      />

      <section className={`ca-container ${styles.section}`}>
        {/* Sticky in-page nav */}
        <nav className={styles.tableOfContents} aria-label="On this page">
          <p className={styles.tocLabel}>On this page</p>
          <ul className={styles.tocList}>
            {RESOURCE_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={styles.tocLink}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {RESOURCE_SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className={styles.sectionBlock}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionBlurb}>{section.blurb}</p>
            </header>

            <ul className={styles.grid}>
              {section.links.map((link) => (
                <li key={link.url}>
                  <ResourceCard link={link} />
                </li>
              ))}
            </ul>
          </article>
        ))}

        <aside className={styles.mentorshipCallout}>
          <div className={styles.calloutMascot} aria-hidden="true">
            <Mascot pose="wave" size={140} />
          </div>
          <div className={styles.calloutCopy}>
            <p className={styles.calloutKicker}>Mentorship</p>
            <h2 className={styles.calloutTitle}>Stuck on something? Ask in Discord.</h2>
            <p className={styles.calloutBody}>
              The alliance runs mentorship informally — every member FC has folks who love showing
              newer players around. Drop a message in <code>#mentorship</code> and someone will
              match you with a mentor (raid, craft, jobs, housing, glam — whatever you need).
            </p>
            <div className={styles.calloutActions}>
              <a
                href="https://discord.gg/cactuar-alliance"
                target="_blank"
                rel="noreferrer"
                className={styles.calloutPrimary}
              >
                Join the Discord ↗
              </a>
              <Link to="/fcs" className={styles.calloutGhost}>
                Browse FCs first
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function ResourceCard({ link }: { link: ResourceLink }) {
  const isExternal = /^https?:\/\//.test(link.url);
  const linkProps = isExternal
    ? { href: link.url, target: '_blank' as const, rel: 'noreferrer' }
    : { href: link.url };

  return (
    <a {...linkProps} className={styles.card}>
      <h3 className={styles.cardTitle}>
        {link.title}
        <span className={styles.cardArrow} aria-hidden="true">
          {isExternal ? '↗' : '→'}
        </span>
      </h3>
      <p className={styles.cardDesc}>{link.description}</p>
    </a>
  );
}
