import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FCCrest } from '../fc/FCCrest';
import { useFC } from '../../api/ca';
import type { ScoredFC } from '../../wizard/scoring';
import styles from './WizardResults.module.css';

interface WizardResultsProps {
  results: ReadonlyArray<ScoredFC>;
  onRestart: () => void;
}

export function WizardResults({ results, onRestart }: WizardResultsProps) {
  if (results.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>No FCs to match against yet.</h2>
        <p>The roster is empty — please come back once member FCs have been listed.</p>
        <button type="button" onClick={onRestart} className={styles.restartBtn}>
          Start over
        </button>
      </div>
    );
  }

  const topScore = results[0].score;

  return (
    <div className={styles.results}>
      <header className={styles.header}>
        <p className={styles.kicker}>Your matches</p>
        <h2 className={styles.title}>
          {topScore >= 70
            ? "Strong matches for you"
            : topScore >= 40
              ? 'Some likely fits'
              : 'A few candidates'}
        </h2>
        <p className={styles.subtitle}>
          Sorted by how well each FC fits your answers. Click into a profile for the full picture.
        </p>
      </header>

      <ol className={styles.list}>
        {results.map((r, i) => (
          <ResultCard key={r.fc.lodestoneId} result={r} rank={i + 1} />
        ))}
      </ol>

      <footer className={styles.footer}>
        <button type="button" onClick={onRestart} className={styles.restartBtn}>
          ← Take the quiz again
        </button>
        <Link to="/fcs" className={styles.directoryLink}>
          Browse the full directory →
        </Link>
      </footer>
    </div>
  );
}

function ResultCard({ result, rank }: { result: ScoredFC; rank: number }) {
  const [reasonsOpen, setReasonsOpen] = useState(rank === 1);
  const { fc, score, reasons } = result;
  const { data: live } = useFC(fc.lodestoneId);
  const crestUrls = live?.lodestone?.crestUrls ?? [];

  return (
    <li className={styles.card}>
      <span className={styles.rank} aria-label={`Rank ${rank}`}>
        #{rank}
      </span>

      <div className={styles.cardHeader}>
        <FCCrest urls={crestUrls} fallbackLabel={fc.tag || fc.name} size={72} />
        <div className={styles.cardIdentity}>
          <h3 className={styles.cardName}>
            <Link to={`/fcs/${fc.lodestoneId}`} className={styles.cardNameLink}>
              {fc.name}
            </Link>
          </h3>
          {fc.tag && <p className={styles.cardTag}>«{fc.tag}»</p>}
          <p className={styles.cardBlurb}>{fc.blurb}</p>
        </div>
        <div className={styles.scoreBlock}>
          <span className={styles.scoreNumber}>{score}</span>
          <span className={styles.scoreLabel}>match</span>
        </div>
      </div>

      <div className={styles.scoreBarTrack} aria-hidden="true">
        <div
          className={styles.scoreBarFill}
          style={{ width: `${score}%` }}
          data-tier={tier(score)}
        />
      </div>

      <div className={styles.reasons}>
        <button
          type="button"
          aria-expanded={reasonsOpen}
          onClick={() => setReasonsOpen((v) => !v)}
          className={styles.reasonsToggle}
        >
          <span>Why this match?</span>
          <span className={styles.reasonsCaret} aria-hidden="true">
            {reasonsOpen ? '−' : '+'}
          </span>
        </button>
        {reasonsOpen && (
          <ul className={styles.reasonsList}>
            {reasons.length === 0 ? (
              <li className={styles.reasonMuted}>
                Limited overlap — consider browsing the directory directly.
              </li>
            ) : (
              reasons.map((reason, i) => <li key={i}>{reason}</li>)
            )}
          </ul>
        )}
      </div>
    </li>
  );
}

function tier(score: number): 'high' | 'mid' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
}
