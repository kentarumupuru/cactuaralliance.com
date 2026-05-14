import { Link } from 'react-router-dom';
import { FCCrest } from './FCCrest';
import { ACTIVITY_LABELS, EXPERIENCE_LABELS, PLAYSTYLE_LABELS, TZ_LABELS } from '../../fc/labels';
import type { FC, LodestoneFC } from '../../types';
import styles from './FCProfile.module.css';

interface FCProfileProps {
  fc: FC;
  live: LodestoneFC | null;
  liveUnavailable: boolean;
}

export function FCProfile({ fc, live, liveUnavailable }: FCProfileProps) {
  const memberCount = live?.memberCount;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/freecompany/${fc.lodestoneId}/`;

  return (
    <article className={styles.profile}>
      {/* ============ Banner: live stats unavailable ============ */}
      {liveUnavailable && (
        <aside className={styles.warning} role="status">
          <span aria-hidden="true">⚠</span>
          <div>
            <strong>Live stats are temporarily unavailable.</strong>
            <p>
              We couldn't reach the Lodestone right now. Member count and crest will refresh on the
              next cache cycle. The FC's profile below comes directly from the alliance roster.
            </p>
          </div>
        </aside>
      )}

      {/* ============ Hero ============ */}
      <header className={styles.hero}>
        <FCCrest urls={live?.crestUrls ?? []} fallbackLabel={fc.tag || fc.name} size={144} />
        <div className={styles.heroCopy}>
          {fc.featured && <span className={styles.featuredBadge}>Featured FC</span>}
          <h1 className={styles.name}>{fc.name}</h1>
          {fc.tag && <p className={styles.tag}>«{fc.tag}»</p>}
          <p className={styles.blurb}>{fc.blurb}</p>

          <div className={styles.heroMeta}>
            {typeof memberCount === 'number' && (
              <Stat label="Members" value={String(memberCount)} />
            )}
            {live?.grandCompany && <Stat label="Grand Company" value={live.grandCompany} />}
            <Stat label="Schedule" value={TZ_LABELS[fc.scheduleTz]} />
            <Stat
              label="Recruiting"
              value={fc.recruiting ? 'Yes' : 'Closed'}
              accent={fc.recruiting ? 'good' : 'muted'}
            />
          </div>
        </div>
      </header>

      {/* ============ Description ============ */}
      {fc.description && (
        <Section title="About">
          <p className={styles.descriptionText}>{fc.description}</p>
        </Section>
      )}

      {/* ============ Specs ============ */}
      <div className={styles.specsGrid}>
        <Section title="Playstyle">
          <p className={styles.spec}>{PLAYSTYLE_LABELS[fc.playstyle]}</p>
          <div className={styles.specPills}>
            {fc.experienceWelcome.map((exp) => (
              <span key={exp} className={styles.pill}>
                {EXPERIENCE_LABELS[exp]} welcome
              </span>
            ))}
          </div>
        </Section>

        <Section title="Schedule">
          <p className={styles.spec}>{TZ_LABELS[fc.scheduleTz]}</p>
          <div className={styles.specPills}>
            {fc.weekendFocus && <span className={styles.pill}>Weekend-focused</span>}
            {fc.weeknightFocus && <span className={styles.pill}>Weeknight-focused</span>}
            {!fc.weekendFocus && !fc.weeknightFocus && (
              <span className={styles.pillMuted}>Schedule varies</span>
            )}
          </div>
        </Section>

        <Section title="Activities">
          <ul className={styles.activityChips}>
            {fc.activities.length === 0 && (
              <li className={styles.pillMuted}>Not specified</li>
            )}
            {fc.activities.map((a) => (
              <li key={a} className={styles.pill}>
                {ACTIVITY_LABELS[a]}
              </li>
            ))}
          </ul>
        </Section>

        {fc.mentorshipOffered.length > 0 && (
          <Section title="Mentorship offered">
            <ul className={styles.activityChips}>
              {fc.mentorshipOffered.map((m) => (
                <li key={m} className={styles.pillAccent}>
                  {capitalize(m)}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {/* ============ Notes ============ */}
      {fc.notes && (
        <Section title="Notes from the FC">
          <p className={styles.descriptionText}>{fc.notes}</p>
        </Section>
      )}

      {/* ============ Actions ============ */}
      <footer className={styles.actions}>
        {fc.discordInvite && (
          <a
            href={fc.discordInvite}
            target="_blank"
            rel="noreferrer"
            className={styles.cta}
          >
            Join their Discord ↗
          </a>
        )}
        <a href={lodestoneUrl} target="_blank" rel="noreferrer" className={styles.ghost}>
          View on Lodestone ↗
        </a>
        <Link to="/fcs" className={styles.backLink}>
          ← Back to directory
        </Link>
      </footer>
    </article>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'good' | 'muted';
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span
        className={
          accent === 'good'
            ? styles.statValueGood
            : accent === 'muted'
              ? styles.statValueMuted
              : styles.statValue
        }
      >
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
