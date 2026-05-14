import { describe, expect, it } from 'vitest';
import { rankFCs, scoreFC, MAX_RAW_SCORE } from './scoring';
import type { FC, WizardAnswers } from '../types';

const baseFC = (overrides: Partial<FC> = {}): FC => ({
  name: 'Test FC',
  tag: 'TST',
  lodestoneId: '1',
  blurb: '',
  description: '',
  recruiting: true,
  playstyle: 'mid-core',
  activities: ['raid', 'social'],
  scheduleTz: 'NA-east',
  weekendFocus: true,
  weeknightFocus: false,
  experienceWelcome: ['returning'],
  mentorshipOffered: [],
  featured: false,
  ...overrides,
});

const baseAnswers = (overrides: Partial<WizardAnswers> = {}): WizardAnswers => ({
  playstyle: 'mid-core',
  activities: ['raid', 'social'],
  scheduleTz: 'NA-east',
  weekendFocus: true,
  weeknightFocus: false,
  experience: 'returning',
  ...overrides,
});

describe('scoreFC — playstyle scoring', () => {
  it('awards 30 points for exact playstyle match', () => {
    const result = scoreFC(baseAnswers({ playstyle: 'casual' }), baseFC({ playstyle: 'casual' }));
    expect(result.breakdown.playstyle).toBe(30);
  });

  it('awards 15 points for adjacent playstyle (casual ↔ mid-core)', () => {
    const result = scoreFC(baseAnswers({ playstyle: 'casual' }), baseFC({ playstyle: 'mid-core' }));
    expect(result.breakdown.playstyle).toBe(15);
  });

  it('awards 15 points for adjacent playstyle (mid-core ↔ hardcore)', () => {
    const result = scoreFC(
      baseAnswers({ playstyle: 'hardcore' }),
      baseFC({ playstyle: 'mid-core' }),
    );
    expect(result.breakdown.playstyle).toBe(15);
  });

  it('awards 0 points for opposite playstyle (casual ↔ hardcore)', () => {
    const result = scoreFC(
      baseAnswers({ playstyle: 'casual' }),
      baseFC({ playstyle: 'hardcore' }),
    );
    expect(result.breakdown.playstyle).toBe(0);
  });

  it('adds a reason when playstyle matches exactly', () => {
    const result = scoreFC(baseAnswers({ playstyle: 'hardcore' }), baseFC({ playstyle: 'hardcore' }));
    expect(result.reasons.some((r) => /hardcore/i.test(r))).toBe(true);
  });
});

describe('scoreFC — activities scoring', () => {
  it('awards 10 points per overlapping activity', () => {
    const result = scoreFC(
      baseAnswers({ activities: ['raid', 'social'] }),
      baseFC({ activities: ['raid', 'social'] }),
    );
    expect(result.breakdown.activities).toBe(20);
  });

  it('caps activity score at 40 (4+ overlapping activities)', () => {
    const result = scoreFC(
      baseAnswers({ activities: ['raid', 'craft', 'social', 'glam', 'rp'] }),
      baseFC({ activities: ['raid', 'craft', 'social', 'glam', 'rp'] }),
    );
    expect(result.breakdown.activities).toBe(40);
  });

  it('awards 0 points when no activities overlap', () => {
    const result = scoreFC(
      baseAnswers({ activities: ['raid'] }),
      baseFC({ activities: ['craft', 'rp'] }),
    );
    expect(result.breakdown.activities).toBe(0);
  });

  it('lists overlapping activities in the reasons', () => {
    const result = scoreFC(
      baseAnswers({ activities: ['raid', 'social'] }),
      baseFC({ activities: ['raid', 'social', 'glam'] }),
    );
    expect(result.reasons.some((r) => /raid/i.test(r))).toBe(true);
  });
});

describe('scoreFC — schedule scoring', () => {
  it('awards 20 points for timezone match', () => {
    const result = scoreFC(
      baseAnswers({ scheduleTz: 'NA-east' }),
      baseFC({ scheduleTz: 'NA-east' }),
    );
    expect(result.breakdown.schedule).toBeGreaterThanOrEqual(20);
  });

  it('awards 0 points for timezone mismatch', () => {
    const a = baseAnswers({ scheduleTz: 'NA-east', weekendFocus: false, weeknightFocus: false });
    const fc = baseFC({ scheduleTz: 'EU', weekendFocus: false, weeknightFocus: false });
    const result = scoreFC(a, fc);
    expect(result.breakdown.schedule).toBe(0);
  });

  it('always matches "mixed" timezone (in either direction)', () => {
    const r1 = scoreFC(baseAnswers({ scheduleTz: 'mixed' }), baseFC({ scheduleTz: 'NA-east' }));
    expect(r1.breakdown.schedule).toBeGreaterThanOrEqual(20);
    const r2 = scoreFC(baseAnswers({ scheduleTz: 'NA-east' }), baseFC({ scheduleTz: 'mixed' }));
    expect(r2.breakdown.schedule).toBeGreaterThanOrEqual(20);
  });

  it('awards 10 points for weekend focus alignment (both true)', () => {
    const a = baseAnswers({ weekendFocus: true, weeknightFocus: false, scheduleTz: 'OCE' });
    const fc = baseFC({ weekendFocus: true, weeknightFocus: false, scheduleTz: 'EU' });
    expect(scoreFC(a, fc).breakdown.schedule).toBe(10);
  });

  it('awards 10 points for weeknight focus alignment', () => {
    const a = baseAnswers({ weekendFocus: false, weeknightFocus: true, scheduleTz: 'OCE' });
    const fc = baseFC({ weekendFocus: false, weeknightFocus: true, scheduleTz: 'EU' });
    expect(scoreFC(a, fc).breakdown.schedule).toBe(10);
  });

  it('awards 20 points for both day-focus alignments', () => {
    const a = baseAnswers({ weekendFocus: true, weeknightFocus: true, scheduleTz: 'OCE' });
    const fc = baseFC({ weekendFocus: true, weeknightFocus: true, scheduleTz: 'EU' });
    expect(scoreFC(a, fc).breakdown.schedule).toBe(20);
  });
});

describe('scoreFC — experience scoring', () => {
  it('awards 20 points when FC welcomes the player level', () => {
    const result = scoreFC(
      baseAnswers({ experience: 'sprout' }),
      baseFC({ experienceWelcome: ['sprout', 'returning'] }),
    );
    expect(result.breakdown.experience).toBe(20);
  });

  it('awards 0 points when FC does not welcome the player level', () => {
    const result = scoreFC(
      baseAnswers({ experience: 'sprout' }),
      baseFC({ experienceWelcome: ['veteran'] }),
    );
    expect(result.breakdown.experience).toBe(0);
  });
});

describe('scoreFC — recruiting bonus', () => {
  it('adds 5 points when FC is actively recruiting', () => {
    const open = scoreFC(baseAnswers(), baseFC({ recruiting: true }));
    const closed = scoreFC(baseAnswers(), baseFC({ recruiting: false }));
    expect(open.breakdown.recruiting).toBe(5);
    expect(closed.breakdown.recruiting).toBe(0);
  });

  it('mentions recruiting status in reasons when open', () => {
    const result = scoreFC(baseAnswers(), baseFC({ recruiting: true }));
    expect(result.reasons.some((r) => /recruit/i.test(r))).toBe(true);
  });
});

describe('scoreFC — normalized score (0-100)', () => {
  it('returns 100 when every category matches perfectly', () => {
    const answers = baseAnswers({
      playstyle: 'mid-core',
      activities: ['raid', 'craft', 'social', 'glam'],
      scheduleTz: 'NA-east',
      weekendFocus: true,
      weeknightFocus: true,
      experience: 'veteran',
    });
    const fc = baseFC({
      playstyle: 'mid-core',
      activities: ['raid', 'craft', 'social', 'glam'],
      scheduleTz: 'NA-east',
      weekendFocus: true,
      weeknightFocus: true,
      experienceWelcome: ['veteran'],
      recruiting: true,
    });
    expect(scoreFC(answers, fc).score).toBe(100);
  });

  it('returns 0 when nothing matches', () => {
    const answers = baseAnswers({
      playstyle: 'casual',
      activities: ['rp'],
      scheduleTz: 'NA-east',
      weekendFocus: false,
      weeknightFocus: false,
      experience: 'sprout',
    });
    const fc = baseFC({
      playstyle: 'hardcore',
      activities: ['craft'],
      scheduleTz: 'EU',
      weekendFocus: false,
      weeknightFocus: false,
      experienceWelcome: ['veteran'],
      recruiting: false,
    });
    expect(scoreFC(answers, fc).score).toBe(0);
  });

  it('normalized score is always between 0 and 100', () => {
    const result = scoreFC(baseAnswers(), baseFC());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('MAX_RAW_SCORE is at least the sum of all category maxes', () => {
    // Sanity: 30 + 40 + 20 + 10 + 10 + 20 + 5 = 135
    expect(MAX_RAW_SCORE).toBeGreaterThanOrEqual(135);
  });
});

describe('rankFCs', () => {
  it('returns FCs sorted by descending score', () => {
    const answers = baseAnswers({ playstyle: 'hardcore', activities: ['raid'] });
    const fcs = [
      baseFC({ name: 'A', playstyle: 'casual', activities: ['craft'] }), // poor match
      baseFC({ name: 'B', playstyle: 'hardcore', activities: ['raid'] }), // best
      baseFC({ name: 'C', playstyle: 'mid-core', activities: ['raid'] }), // middle
    ];
    const ranked = rankFCs(answers, fcs);
    expect(ranked.map((r) => r.fc.name)).toEqual(['B', 'C', 'A']);
  });

  it('respects the limit parameter (top 5 by default if not specified)', () => {
    const fcs = Array.from({ length: 10 }, (_, i) =>
      baseFC({ name: `FC${i}`, lodestoneId: String(i) }),
    );
    const ranked = rankFCs(baseAnswers(), fcs, 3);
    expect(ranked).toHaveLength(3);
  });

  it('returns empty array when given no FCs', () => {
    expect(rankFCs(baseAnswers(), [])).toEqual([]);
  });

  it('includes the per-FC reasons', () => {
    const ranked = rankFCs(baseAnswers(), [baseFC({ recruiting: true })]);
    expect(ranked[0].reasons.length).toBeGreaterThan(0);
  });
});
