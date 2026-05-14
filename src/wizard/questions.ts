import type { Activity, Experience, Playstyle, Tz } from '../types';

export interface PlaystyleOption {
  value: Playstyle;
  title: string;
  description: string;
}

export interface ScheduleOption {
  value: Tz;
  label: string;
}

export interface ExperienceOption {
  value: Experience;
  title: string;
  description: string;
}

export interface ActivityOption {
  value: Activity;
  label: string;
  hint: string;
}

export const PLAYSTYLE_OPTIONS: ReadonlyArray<PlaystyleOption> = [
  {
    value: 'casual',
    title: 'Casual',
    description:
      'I log in for friends, glam, and roulettes. No raid pressure — just having a good time in Eorzea.',
  },
  {
    value: 'mid-core',
    title: 'Mid-core',
    description:
      "I want to clear current Savage on a relaxed schedule. Some weeks I'm hardcore, some weeks I'm not.",
  },
  {
    value: 'hardcore',
    title: 'Hardcore',
    description:
      "I'm here for the hardest content the game offers. Savage day-one, Ultimate prog, and parsing.",
  },
];

export const TZ_OPTIONS: ReadonlyArray<ScheduleOption> = [
  { value: 'NA-east', label: 'NA East' },
  { value: 'NA-west', label: 'NA West' },
  { value: 'EU', label: 'EU' },
  { value: 'OCE', label: 'Oceania' },
  { value: 'mixed', label: 'Flexible / Mixed' },
];

export const EXPERIENCE_OPTIONS: ReadonlyArray<ExperienceOption> = [
  {
    value: 'sprout',
    title: 'Sprout',
    description: 'New to FFXIV — still discovering jobs, MSQ, and which beast tribe pet is best.',
  },
  {
    value: 'returning',
    title: 'Returning',
    description: 'I played before. Coming back for an expansion, fresh content, or just nostalgia.',
  },
  {
    value: 'veteran',
    title: 'Veteran',
    description: 'Years in. Multiple jobs maxed, MSQ done, looking for a community to land with.',
  },
];

export const ACTIVITY_OPTIONS: ReadonlyArray<ActivityOption> = [
  { value: 'raid', label: 'Raiding', hint: 'Savage, Ultimate, Extreme prog' },
  { value: 'roulettes', label: 'Daily roulettes', hint: 'Tomes & poetics with friends' },
  { value: 'craft', label: 'Crafting & gathering', hint: 'DoH/DoL — gear, food, melds' },
  { value: 'rp', label: 'Roleplay', hint: 'Tavern nights, character stories' },
  { value: 'pvp', label: 'PvP', hint: 'Crystalline Conflict, Frontline' },
  { value: 'social', label: 'Social hangouts', hint: 'Chat, glam, hangouts' },
  { value: 'glam', label: 'Glamour & fashion', hint: 'Eorzea Collection, gpose' },
  { value: 'housing', label: 'Housing & decorating', hint: 'FC houses, apartments' },
  { value: 'treasure-hunt', label: 'Treasure maps', hint: 'Maps, hunts, deep dungeons' },
];

export type WizardStepId = 'playstyle' | 'activities' | 'schedule' | 'experience';

export const WIZARD_STEPS: ReadonlyArray<{ id: WizardStepId; title: string; subtitle: string }> = [
  {
    id: 'playstyle',
    title: 'How do you want to play?',
    subtitle: 'There are no wrong answers — this just helps us find FCs that match your pace.',
  },
  {
    id: 'activities',
    title: 'What sounds fun?',
    subtitle: 'Pick everything that appeals. FCs that share more of your interests will rank higher.',
  },
  {
    id: 'schedule',
    title: 'When do you play?',
    subtitle: "Time zone and rhythm matter — let's find FCs that are awake when you are.",
  },
  {
    id: 'experience',
    title: 'Where are you in your journey?',
    subtitle: 'Some FCs love welcoming new sprouts, others want raid-ready vets. No judgment.',
  },
];
