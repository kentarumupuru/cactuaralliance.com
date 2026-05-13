import { describe, expect, it } from 'vitest';
import { rowsToFCs, type SheetRow } from './fc-mapper';

const validRow = (): SheetRow => ({
  name: 'The Moonlighters Guild',
  tag: 'MOON',
  lodestone_id: '9229220869975139946',
  blurb: 'Social-first, weekend raids.',
  description: 'Long-running CA partner.',
  recruiting: 'yes',
  playstyle: 'mid-core',
  activities: 'raid,social,glam,housing',
  schedule_tz: 'NA-east',
  weekend_focus: 'true',
  weeknight_focus: 'false',
  experience_welcome: 'sprout,returning,veteran',
  mentorship_offered: 'raid,jobs',
  discord_invite: 'https://discord.gg/x',
  featured: 'yes',
  notes: 'Hosts trivia.',
});

describe('rowsToFCs', () => {
  it('maps a complete valid row to an FC', () => {
    const fcs = rowsToFCs([validRow()]);
    expect(fcs).toHaveLength(1);
    expect(fcs[0]).toEqual({
      name: 'The Moonlighters Guild',
      tag: 'MOON',
      lodestoneId: '9229220869975139946',
      blurb: 'Social-first, weekend raids.',
      description: 'Long-running CA partner.',
      recruiting: true,
      playstyle: 'mid-core',
      activities: ['raid', 'social', 'glam', 'housing'],
      scheduleTz: 'NA-east',
      weekendFocus: true,
      weeknightFocus: false,
      experienceWelcome: ['sprout', 'returning', 'veteran'],
      mentorshipOffered: ['raid', 'jobs'],
      discordInvite: 'https://discord.gg/x',
      featured: true,
      notes: 'Hosts trivia.',
    });
  });

  it('drops rows missing required name', () => {
    const row = validRow();
    row.name = '';
    expect(rowsToFCs([row])).toEqual([]);
  });

  it('drops rows missing required lodestone_id', () => {
    const row = validRow();
    row.lodestone_id = '';
    expect(rowsToFCs([row])).toEqual([]);
  });

  it('drops rows with non-numeric lodestone_id', () => {
    const row = validRow();
    row.lodestone_id = 'not-a-number';
    expect(rowsToFCs([row])).toEqual([]);
  });

  it('treats various truthy values for booleans', () => {
    const row = validRow();
    row.recruiting = 'YES';
    row.featured = 'TRUE';
    row.weekend_focus = '1';
    row.weeknight_focus = 'y';
    const fc = rowsToFCs([row])[0];
    expect(fc.recruiting).toBe(true);
    expect(fc.featured).toBe(true);
    expect(fc.weekendFocus).toBe(true);
    expect(fc.weeknightFocus).toBe(true);
  });

  it('treats blank/no/false as false for booleans', () => {
    const row = validRow();
    row.recruiting = 'no';
    row.featured = '';
    row.weekend_focus = 'false';
    row.weeknight_focus = '0';
    const fc = rowsToFCs([row])[0];
    expect(fc.recruiting).toBe(false);
    expect(fc.featured).toBe(false);
    expect(fc.weekendFocus).toBe(false);
    expect(fc.weeknightFocus).toBe(false);
  });

  it('clamps invalid playstyle to "casual"', () => {
    const row = validRow();
    row.playstyle = 'extreme-omegacore';
    expect(rowsToFCs([row])[0].playstyle).toBe('casual');
  });

  it('clamps invalid schedule_tz to "mixed"', () => {
    const row = validRow();
    row.schedule_tz = 'Mars-standard';
    expect(rowsToFCs([row])[0].scheduleTz).toBe('mixed');
  });

  it('filters unknown activities out, keeps known ones, preserves order', () => {
    const row = validRow();
    row.activities = 'raid, unknown , social ,;,glam,';
    expect(rowsToFCs([row])[0].activities).toEqual(['raid', 'social', 'glam']);
  });

  it('filters unknown experience levels', () => {
    const row = validRow();
    row.experience_welcome = 'sprout,godlike,veteran';
    expect(rowsToFCs([row])[0].experienceWelcome).toEqual(['sprout', 'veteran']);
  });

  it('returns an empty array when given an empty row list', () => {
    expect(rowsToFCs([])).toEqual([]);
  });

  it('omits optional discord_invite when blank', () => {
    const row = validRow();
    row.discord_invite = '';
    const fc = rowsToFCs([row])[0];
    expect(fc.discordInvite).toBeUndefined();
  });

  it('omits optional notes when blank', () => {
    const row = validRow();
    row.notes = '';
    const fc = rowsToFCs([row])[0];
    expect(fc.notes).toBeUndefined();
  });

  it('trims leading/trailing whitespace on string fields', () => {
    const row = validRow();
    row.name = '  Moonlighters  ';
    row.tag = '  MOON  ';
    row.blurb = '  hello  ';
    const fc = rowsToFCs([row])[0];
    expect(fc.name).toBe('Moonlighters');
    expect(fc.tag).toBe('MOON');
    expect(fc.blurb).toBe('hello');
  });

  it('dedupes activities and experience while preserving order', () => {
    const row = validRow();
    row.activities = 'raid,social,raid,glam,social';
    row.experience_welcome = 'sprout,veteran,sprout';
    const fc = rowsToFCs([row])[0];
    expect(fc.activities).toEqual(['raid', 'social', 'glam']);
    expect(fc.experienceWelcome).toEqual(['sprout', 'veteran']);
  });
});
