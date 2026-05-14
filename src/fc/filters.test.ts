import { describe, expect, it } from 'vitest';
import { applyFCFilters, EMPTY_FILTERS, type FCFilters } from './filters';
import type { FC } from '../types';

const fc = (overrides: Partial<FC> = {}): FC => ({
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
  experienceWelcome: ['sprout', 'returning', 'veteran'],
  mentorshipOffered: [],
  featured: false,
  ...overrides,
});

const filters = (overrides: Partial<FCFilters> = {}): FCFilters => ({
  ...EMPTY_FILTERS,
  ...overrides,
});

describe('applyFCFilters', () => {
  it('returns all FCs when no filters are active', () => {
    const list = [fc({ name: 'A' }), fc({ name: 'B' }), fc({ name: 'C' })];
    expect(applyFCFilters(list, EMPTY_FILTERS)).toHaveLength(3);
  });

  it('filters by recruiting=true (only recruiting FCs)', () => {
    const list = [
      fc({ name: 'Open', recruiting: true }),
      fc({ name: 'Closed', recruiting: false }),
    ];
    const result = applyFCFilters(list, filters({ recruitingOnly: true }));
    expect(result.map((f) => f.name)).toEqual(['Open']);
  });

  it('filters by playstyle', () => {
    const list = [
      fc({ name: 'Chill', playstyle: 'casual' }),
      fc({ name: 'Sweat', playstyle: 'hardcore' }),
      fc({ name: 'Mid', playstyle: 'mid-core' }),
    ];
    const result = applyFCFilters(list, filters({ playstyles: ['casual', 'hardcore'] }));
    expect(result.map((f) => f.name).sort()).toEqual(['Chill', 'Sweat']);
  });

  it('filters by activities (FC must have ALL requested activities)', () => {
    const list = [
      fc({ name: 'RaidSocial', activities: ['raid', 'social'] }),
      fc({ name: 'RaidOnly', activities: ['raid'] }),
      fc({ name: 'CraftOnly', activities: ['craft'] }),
    ];
    const result = applyFCFilters(list, filters({ activities: ['raid', 'social'] }));
    expect(result.map((f) => f.name)).toEqual(['RaidSocial']);
  });

  it('matches search query against name (case-insensitive)', () => {
    const list = [fc({ name: 'Moonlighters Guild' }), fc({ name: 'Brave Coil' })];
    expect(applyFCFilters(list, filters({ search: 'moon' })).map((f) => f.name)).toEqual([
      'Moonlighters Guild',
    ]);
    expect(applyFCFilters(list, filters({ search: 'COIL' })).map((f) => f.name)).toEqual([
      'Brave Coil',
    ]);
  });

  it('matches search query against tag', () => {
    const list = [fc({ name: 'A', tag: 'MOON' }), fc({ name: 'B', tag: 'SUN' })];
    expect(applyFCFilters(list, filters({ search: 'moon' })).map((f) => f.name)).toEqual(['A']);
  });

  it('matches search query against blurb', () => {
    const list = [
      fc({ name: 'A', blurb: 'Hosts the trivia night' }),
      fc({ name: 'B', blurb: 'Raid focused' }),
    ];
    expect(applyFCFilters(list, filters({ search: 'trivia' })).map((f) => f.name)).toEqual(['A']);
  });

  it('ignores leading/trailing whitespace in search', () => {
    const list = [fc({ name: 'Moonlighters' })];
    expect(applyFCFilters(list, filters({ search: '   moon   ' }))).toHaveLength(1);
  });

  it('combines filters with AND logic', () => {
    const list = [
      fc({ name: 'A', recruiting: true, playstyle: 'casual', activities: ['raid', 'social'] }),
      fc({ name: 'B', recruiting: true, playstyle: 'hardcore', activities: ['raid', 'social'] }),
      fc({ name: 'C', recruiting: false, playstyle: 'casual', activities: ['raid', 'social'] }),
      fc({ name: 'D', recruiting: true, playstyle: 'casual', activities: ['craft'] }),
    ];
    const result = applyFCFilters(
      list,
      filters({ recruitingOnly: true, playstyles: ['casual'], activities: ['raid'] }),
    );
    expect(result.map((f) => f.name)).toEqual(['A']);
  });

  it('returns empty array when no FC matches', () => {
    const list = [fc({ name: 'A', playstyle: 'casual' })];
    expect(applyFCFilters(list, filters({ playstyles: ['hardcore'] }))).toEqual([]);
  });

  it('sorts featured FCs first when sortByFeatured is true', () => {
    const list = [
      fc({ name: 'A', featured: false }),
      fc({ name: 'B', featured: true }),
      fc({ name: 'C', featured: false }),
      fc({ name: 'D', featured: true }),
    ];
    const result = applyFCFilters(list, filters({ sortByFeatured: true }));
    expect(result.slice(0, 2).every((f) => f.featured)).toBe(true);
    expect(result.slice(2).every((f) => !f.featured)).toBe(true);
  });

  it('preserves input order when sortByFeatured is false', () => {
    const list = [
      fc({ name: 'A', featured: false }),
      fc({ name: 'B', featured: true }),
      fc({ name: 'C', featured: false }),
    ];
    const result = applyFCFilters(list, filters({ sortByFeatured: false }));
    expect(result.map((f) => f.name)).toEqual(['A', 'B', 'C']);
  });
});
