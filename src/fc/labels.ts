import type { Activity, Experience, Playstyle, Tz } from '../types';

export const PLAYSTYLE_LABELS: Record<Playstyle, string> = {
  casual: 'Casual',
  'mid-core': 'Mid-core',
  hardcore: 'Hardcore',
};

export const ACTIVITY_LABELS: Record<Activity, string> = {
  raid: 'Raid',
  craft: 'Craft',
  rp: 'RP',
  pvp: 'PvP',
  social: 'Social',
  'treasure-hunt': 'Treasure Hunt',
  glam: 'Glam',
  housing: 'Housing',
  roulettes: 'Roulettes',
};

export const TZ_LABELS: Record<Tz, string> = {
  'NA-east': 'NA East',
  'NA-west': 'NA West',
  EU: 'EU',
  OCE: 'OCE',
  mixed: 'Mixed',
};

export const EXPERIENCE_LABELS: Record<Experience, string> = {
  sprout: 'New players',
  returning: 'Returning',
  veteran: 'Veterans',
};

export const ALL_PLAYSTYLES: ReadonlyArray<Playstyle> = ['casual', 'mid-core', 'hardcore'];

export const ALL_ACTIVITIES: ReadonlyArray<Activity> = [
  'raid',
  'craft',
  'rp',
  'pvp',
  'social',
  'roulettes',
  'glam',
  'housing',
  'treasure-hunt',
];
