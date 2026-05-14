import {
  ACTIVITY_LABELS,
  EXPERIENCE_LABELS,
  PLAYSTYLE_LABELS,
  TZ_LABELS,
} from '../fc/labels';
import type { Activity, FC, MatchResult, Playstyle, WizardAnswers } from '../types';

/**
 * Find Your FC scoring engine. Pure function — `scoreFC(answers, fc)` returns
 * a deterministic 0–100 score plus a breakdown and a list of human-readable
 * reasons that explain the match. Used by the wizard's results screen.
 */

interface ScoreBreakdown {
  playstyle: number;
  activities: number;
  schedule: number;
  experience: number;
  recruiting: number;
}

export interface ScoredFC extends MatchResult {
  breakdown: ScoreBreakdown;
}

const W_PLAYSTYLE_MATCH = 30;
const W_PLAYSTYLE_ADJACENT = 15;
const W_ACTIVITY_EACH = 10;
const W_ACTIVITY_CAP = 40;
const W_TZ_MATCH = 20;
const W_DAY_FOCUS = 10;
const W_EXPERIENCE = 20;
const W_RECRUITING = 5;

export const MAX_RAW_SCORE =
  W_PLAYSTYLE_MATCH + W_ACTIVITY_CAP + W_TZ_MATCH + W_DAY_FOCUS * 2 + W_EXPERIENCE + W_RECRUITING;

const PLAYSTYLE_ORDER: ReadonlyArray<Playstyle> = ['casual', 'mid-core', 'hardcore'];

function playstyleDistance(a: Playstyle, b: Playstyle): number {
  return Math.abs(PLAYSTYLE_ORDER.indexOf(a) - PLAYSTYLE_ORDER.indexOf(b));
}

function overlap<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): T[] {
  const seen = new Set(b);
  return a.filter((x) => seen.has(x));
}

export function scoreFC(answers: WizardAnswers, fc: FC): ScoredFC {
  const reasons: string[] = [];
  const breakdown: ScoreBreakdown = {
    playstyle: 0,
    activities: 0,
    schedule: 0,
    experience: 0,
    recruiting: 0,
  };

  // Playstyle
  const dist = playstyleDistance(answers.playstyle, fc.playstyle);
  if (dist === 0) {
    breakdown.playstyle = W_PLAYSTYLE_MATCH;
    reasons.push(`Matches your ${PLAYSTYLE_LABELS[answers.playstyle].toLowerCase()} playstyle`);
  } else if (dist === 1) {
    breakdown.playstyle = W_PLAYSTYLE_ADJACENT;
    reasons.push(
      `${PLAYSTYLE_LABELS[fc.playstyle]} pace — close to your ${PLAYSTYLE_LABELS[
        answers.playstyle
      ].toLowerCase()} preference`,
    );
  }

  // Activities
  const overlappingActivities: Activity[] = overlap(answers.activities, fc.activities);
  const activityScore = Math.min(
    W_ACTIVITY_CAP,
    overlappingActivities.length * W_ACTIVITY_EACH,
  );
  breakdown.activities = activityScore;
  if (overlappingActivities.length > 0) {
    const labels = overlappingActivities.map((a) => ACTIVITY_LABELS[a]);
    if (labels.length === 1) {
      reasons.push(`Shares your interest in ${labels[0]}`);
    } else if (labels.length === 2) {
      reasons.push(`Shares your interest in ${labels[0]} and ${labels[1]}`);
    } else {
      const head = labels.slice(0, -1).join(', ');
      const tail = labels[labels.length - 1];
      reasons.push(`Shares your interest in ${head}, and ${tail}`);
    }
  }

  // Schedule — timezone + day-focus alignment
  const tzMatch =
    answers.scheduleTz === fc.scheduleTz ||
    answers.scheduleTz === 'mixed' ||
    fc.scheduleTz === 'mixed';
  if (tzMatch) {
    breakdown.schedule += W_TZ_MATCH;
    if (answers.scheduleTz !== 'mixed' && fc.scheduleTz !== 'mixed') {
      reasons.push(`Plays in your ${TZ_LABELS[answers.scheduleTz]} timezone`);
    }
  }

  if (answers.weekendFocus && fc.weekendFocus) {
    breakdown.schedule += W_DAY_FOCUS;
    reasons.push('Active on weekends, like you');
  }
  if (answers.weeknightFocus && fc.weeknightFocus) {
    breakdown.schedule += W_DAY_FOCUS;
    reasons.push('Active on weeknights, like you');
  }

  // Experience
  if (fc.experienceWelcome.includes(answers.experience)) {
    breakdown.experience = W_EXPERIENCE;
    reasons.push(`Welcomes ${EXPERIENCE_LABELS[answers.experience].toLowerCase()}`);
  }

  // Recruiting bonus
  if (fc.recruiting) {
    breakdown.recruiting = W_RECRUITING;
    reasons.push('Currently recruiting');
  }

  const raw =
    breakdown.playstyle +
    breakdown.activities +
    breakdown.schedule +
    breakdown.experience +
    breakdown.recruiting;

  const score = Math.round((raw / MAX_RAW_SCORE) * 100);

  return { fc, score, reasons, breakdown };
}

export function rankFCs(
  answers: WizardAnswers,
  fcs: ReadonlyArray<FC>,
  limit = 5,
): ScoredFC[] {
  return fcs
    .map((fc) => scoreFC(answers, fc))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit);
}
