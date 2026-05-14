import { useMemo, useState } from 'react';
import { useFCs } from '../api/ca';
import { PageHero } from '../components/layout/PageHero';
import { WizardFlow } from '../components/wizard/WizardFlow';
import { WizardResults } from '../components/wizard/WizardResults';
import { rankFCs } from '../wizard/scoring';
import type { WizardAnswers } from '../types';
import styles from './FindYourFCPage.module.css';

export default function FindYourFCPage() {
  const { data, isPending, isError, error } = useFCs();
  const [answers, setAnswers] = useState<WizardAnswers | null>(null);

  const results = useMemo(() => {
    if (!data || !answers) return [];
    return rankFCs(answers, data.fcs, 5);
  }, [data, answers]);

  return (
    <>
      <PageHero
        eyebrow="Four quick questions"
        title={answers ? 'Your top matches' : 'Find your FC'}
        lede={
          answers
            ? "Here's how the alliance's FCs line up against your answers."
            : "Tell us how you play and we'll match you with FCs that fit. Takes about a minute."
        }
        mascotPose="think"
      />

      <section className={`ca-container ${styles.section}`}>
        {isPending && <p className={styles.loading}>Loading the roster…</p>}

        {isError && (
          <div className={styles.errorBox} role="alert">
            <h2>We couldn't load the alliance roster.</h2>
            <p>
              <code>{error.message}</code>
            </p>
          </div>
        )}

        {data && !answers && <WizardFlow onComplete={setAnswers} />}

        {data && answers && (
          <WizardResults results={results} onRestart={() => setAnswers(null)} />
        )}
      </section>
    </>
  );
}
