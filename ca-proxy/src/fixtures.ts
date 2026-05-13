import type { FC } from './types';

/**
 * Placeholder FC roster used while the Google Sheet integration is being built
 * (Milestone 5). Once /fcs reads from the published sheet via sheet.ts, this
 * file is deleted.
 */
export const FIXTURE_FCS: ReadonlyArray<FC> = [
  {
    name: 'The Moonlighters Guild',
    tag: 'MOON',
    lodestoneId: '9229220869975139946', // placeholder — replace with real ID
    blurb: 'Long-running CA partner, social-first with weekend raids.',
    description:
      'Established in 2.x, The Moonlighters Guild is one of the original Cactuar Alliance partners. We balance a relaxed atmosphere with active raid teams that meet on weekends.',
    recruiting: true,
    playstyle: 'mid-core',
    activities: ['raid', 'social', 'glam', 'housing'],
    scheduleTz: 'NA-east',
    weekendFocus: true,
    weeknightFocus: false,
    experienceWelcome: ['sprout', 'returning', 'veteran'],
    mentorshipOffered: ['raid', 'jobs'],
    discordInvite: 'https://discord.gg/moonlighters',
    featured: true,
    notes: 'Hosts the monthly cross-FC trivia night.',
  },
  {
    name: 'Sun-Warmed Spires',
    tag: 'SUN',
    lodestoneId: '9229220869975139947',
    blurb: 'Small, chill FC focused on crafting and housing decorating.',
    description:
      "We're a tight-knit group that took up gathering and crafting as our main thing. If you want to learn the crafting jobs from people who genuinely enjoy them, we're a good fit.",
    recruiting: true,
    playstyle: 'casual',
    activities: ['craft', 'housing', 'glam', 'social'],
    scheduleTz: 'NA-west',
    weekendFocus: true,
    weeknightFocus: true,
    experienceWelcome: ['sprout', 'returning'],
    mentorshipOffered: ['craft', 'gather'],
    featured: true,
  },
  {
    name: 'Brave Coil',
    tag: 'COIL',
    lodestoneId: '9229220869975139948',
    blurb: 'Static-friendly hardcore raid FC. Savage and Ultimate clears.',
    description:
      "Brave Coil exists for one reason: clearing the hardest content FFXIV has. We run multiple Savage statics and an Ultimate prog group. Sprouts welcome if you're hungry to learn.",
    recruiting: true,
    playstyle: 'hardcore',
    activities: ['raid', 'roulettes'],
    scheduleTz: 'NA-east',
    weekendFocus: false,
    weeknightFocus: true,
    experienceWelcome: ['veteran'],
    mentorshipOffered: ['raid', 'jobs'],
    featured: true,
  },
  {
    name: "Bard's Rest Tavern",
    tag: 'BARD',
    lodestoneId: '9229220869975139949',
    blurb: 'RP-focused with an in-character tavern in the Lavender Beds.',
    description:
      'A heavy-RP FC running a weekly in-character tavern night. Stories, music, and questionable life choices for your character.',
    recruiting: true,
    playstyle: 'casual',
    activities: ['rp', 'social', 'glam'],
    scheduleTz: 'mixed',
    weekendFocus: true,
    weeknightFocus: false,
    experienceWelcome: ['sprout', 'returning', 'veteran'],
    mentorshipOffered: ['glam'],
    featured: false,
  },
];
