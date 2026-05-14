import { useState } from 'react';
import {
  ACTIVITY_OPTIONS,
  EXPERIENCE_OPTIONS,
  PLAYSTYLE_OPTIONS,
  TZ_OPTIONS,
  WIZARD_STEPS,
  type WizardStepId,
} from '../../wizard/questions';
import type { Activity, Experience, Playstyle, Tz, WizardAnswers } from '../../types';
import styles from './WizardFlow.module.css';

interface WizardFlowProps {
  onComplete: (answers: WizardAnswers) => void;
}

interface DraftAnswers {
  playstyle?: Playstyle;
  activities: Activity[];
  scheduleTz?: Tz;
  weekendFocus: boolean;
  weeknightFocus: boolean;
  experience?: Experience;
}

const INITIAL: DraftAnswers = {
  activities: [],
  weekendFocus: false,
  weeknightFocus: false,
};

export function WizardFlow({ onComplete }: WizardFlowProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState<DraftAnswers>(INITIAL);

  const step = WIZARD_STEPS[stepIdx];
  const isLastStep = stepIdx === WIZARD_STEPS.length - 1;
  const canAdvance = isStepValid(step.id, draft);

  function next() {
    if (!canAdvance) return;
    if (isLastStep) {
      onComplete(toAnswers(draft));
    } else {
      setStepIdx((i) => i + 1);
    }
  }

  function back() {
    setStepIdx((i) => Math.max(0, i - 1));
  }

  return (
    <div className={styles.flow}>
      <Progress current={stepIdx + 1} total={WIZARD_STEPS.length} />

      <header className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>{step.title}</h2>
        <p className={styles.stepSubtitle}>{step.subtitle}</p>
      </header>

      <div className={styles.stepBody}>
        {step.id === 'playstyle' && (
          <PlaystyleStep draft={draft} onChange={setDraft} />
        )}
        {step.id === 'activities' && (
          <ActivitiesStep draft={draft} onChange={setDraft} />
        )}
        {step.id === 'schedule' && (
          <ScheduleStep draft={draft} onChange={setDraft} />
        )}
        {step.id === 'experience' && (
          <ExperienceStep draft={draft} onChange={setDraft} />
        )}
      </div>

      <footer className={styles.nav}>
        <button
          type="button"
          onClick={back}
          disabled={stepIdx === 0}
          className={styles.backBtn}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canAdvance}
          className={styles.nextBtn}
        >
          {isLastStep ? 'See my matches →' : 'Next →'}
        </button>
      </footer>
    </div>
  );
}

/* ============================================================
   Steps
   ============================================================ */

interface StepProps {
  draft: DraftAnswers;
  onChange: (next: DraftAnswers) => void;
}

function PlaystyleStep({ draft, onChange }: StepProps) {
  return (
    <ul className={styles.choices}>
      {PLAYSTYLE_OPTIONS.map((opt) => {
        const isOn = draft.playstyle === opt.value;
        return (
          <li key={opt.value}>
            <button
              type="button"
              aria-pressed={isOn}
              onClick={() => onChange({ ...draft, playstyle: opt.value })}
              className={`${styles.choice} ${isOn ? styles.choiceOn : ''}`}
            >
              <span className={styles.choiceTitle}>{opt.title}</span>
              <span className={styles.choiceDesc}>{opt.description}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ActivitiesStep({ draft, onChange }: StepProps) {
  function toggle(a: Activity) {
    const next = draft.activities.includes(a)
      ? draft.activities.filter((x) => x !== a)
      : [...draft.activities, a];
    onChange({ ...draft, activities: next });
  }

  return (
    <ul className={styles.activityGrid}>
      {ACTIVITY_OPTIONS.map((opt) => {
        const isOn = draft.activities.includes(opt.value);
        return (
          <li key={opt.value}>
            <button
              type="button"
              aria-pressed={isOn}
              onClick={() => toggle(opt.value)}
              className={`${styles.activity} ${isOn ? styles.activityOn : ''}`}
            >
              <span className={styles.activityCheck} aria-hidden="true">
                {isOn ? '✓' : ''}
              </span>
              <span>
                <span className={styles.activityLabel}>{opt.label}</span>
                <span className={styles.activityHint}>{opt.hint}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ScheduleStep({ draft, onChange }: StepProps) {
  return (
    <div className={styles.scheduleStack}>
      <fieldset className={styles.subFieldset}>
        <legend>Your time zone</legend>
        <ul className={styles.tzGrid}>
          {TZ_OPTIONS.map((opt) => {
            const isOn = draft.scheduleTz === opt.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => onChange({ ...draft, scheduleTz: opt.value })}
                  className={`${styles.tzChip} ${isOn ? styles.tzChipOn : ''}`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className={styles.subFieldset}>
        <legend>When are you usually online?</legend>
        <p className={styles.subHint}>Pick neither, one, or both — whatever fits.</p>
        <div className={styles.toggleRow}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={draft.weekendFocus}
              onChange={(e) => onChange({ ...draft, weekendFocus: e.target.checked })}
            />
            <span>Weekends</span>
          </label>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={draft.weeknightFocus}
              onChange={(e) => onChange({ ...draft, weeknightFocus: e.target.checked })}
            />
            <span>Weeknights</span>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function ExperienceStep({ draft, onChange }: StepProps) {
  return (
    <ul className={styles.choices}>
      {EXPERIENCE_OPTIONS.map((opt) => {
        const isOn = draft.experience === opt.value;
        return (
          <li key={opt.value}>
            <button
              type="button"
              aria-pressed={isOn}
              onClick={() => onChange({ ...draft, experience: opt.value })}
              className={`${styles.choice} ${isOn ? styles.choiceOn : ''}`}
            >
              <span className={styles.choiceTitle}>{opt.title}</span>
              <span className={styles.choiceDesc}>{opt.description}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ============================================================
   Progress dots
   ============================================================ */

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className={styles.progress} aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`${styles.progressDot} ${i < current ? styles.progressDotDone : ''}`}
          aria-hidden="true"
        />
      ))}
      <span className={styles.progressLabel}>
        {current} / {total}
      </span>
    </div>
  );
}

/* ============================================================
   Validation + conversion
   ============================================================ */

function isStepValid(stepId: WizardStepId, draft: DraftAnswers): boolean {
  switch (stepId) {
    case 'playstyle':
      return Boolean(draft.playstyle);
    case 'activities':
      return draft.activities.length > 0;
    case 'schedule':
      return Boolean(draft.scheduleTz);
    case 'experience':
      return Boolean(draft.experience);
  }
}

function toAnswers(draft: DraftAnswers): WizardAnswers {
  // All four values are required by isStepValid before reaching this point.
  return {
    playstyle: draft.playstyle!,
    activities: draft.activities,
    scheduleTz: draft.scheduleTz!,
    weekendFocus: draft.weekendFocus,
    weeknightFocus: draft.weeknightFocus,
    experience: draft.experience!,
  };
}
