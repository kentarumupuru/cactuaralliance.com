import { Link } from 'react-router-dom';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    n: '01',
    title: 'Browse the alliance',
    body:
      'See every member Free Company with live stats from the Lodestone — crest, member count, recruiting status.',
    href: '/fcs',
    cta: 'Browse FCs',
  },
  {
    n: '02',
    title: 'Take the matching quiz',
    body:
      'Four quick questions about playstyle, schedule, activities, and experience — we rank the FCs that fit you best.',
    href: '/find-your-fc',
    cta: 'Find your FC',
  },
  {
    n: '03',
    title: 'Land somewhere good',
    body:
      'Hop into the alliance Discord, introduce yourself to an FC that caught your eye, and you’re in.',
    href: '/resources',
    cta: 'See resources',
  },
];

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <p className={styles.kicker}>How it works</p>
        <h2 className={styles.title}>From “new to Cactuar” to “in an FC” in three steps</h2>
      </header>

      <ol className={styles.steps}>
        {STEPS.map((s) => (
          <li key={s.n} className={styles.step}>
            <span className={styles.stepNum} aria-hidden="true">
              {s.n}
            </span>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepBody}>{s.body}</p>
            <Link to={s.href} className={styles.stepCta}>
              {s.cta} →
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
