export interface ResourceLink {
  title: string;
  url: string;
  description: string;
}

export interface ResourceSection {
  id: string;
  title: string;
  blurb: string;
  links: ResourceLink[];
}

export const RESOURCE_SECTIONS: ReadonlyArray<ResourceSection> = [
  {
    id: 'sprouts',
    title: 'New to FFXIV?',
    blurb:
      'Start here. These cover the basics — what jobs do, how the MSQ works, and what to do at level cap.',
    links: [
      {
        title: 'New Player Hub (Lodestone)',
        url: 'https://na.finalfantasyxiv.com/new_to_ffxiv/',
        description: 'Square Enix’s official starter guide — free trial info, jobs, basic systems.',
      },
      {
        title: 'A Sprout’s Survival Guide',
        url: 'https://gamerescape.com/wiki/Stormblood_Guide_for_New_Players',
        description: 'Gamer Escape’s onboarding wiki — comprehensive walkthrough.',
      },
      {
        title: 'Bunny’s Roadmap to 90+',
        url: 'https://www.akhmorning.com/',
        description: 'Akh Morning — community-maintained leveling and gearing reference.',
      },
    ],
  },
  {
    id: 'jobs',
    title: 'Jobs & rotations',
    blurb: 'How to play your job at level cap — opener guides, cheat sheets, and theorycraft.',
    links: [
      {
        title: 'The Balance — Job guides',
        url: 'https://thebalanceffxiv.com/',
        description: 'The community standard. Every job, every tier, every prog level.',
      },
      {
        title: 'Icy Veins FFXIV',
        url: 'https://www.icy-veins.com/ffxiv/',
        description: 'Approachable rotation breakdowns and gearing for casual-to-mid raiders.',
      },
      {
        title: 'XIVAnalysis',
        url: 'https://xivanalysis.com/',
        description: 'Paste an FFLogs report — get an automated rotation autopsy.',
      },
    ],
  },
  {
    id: 'raid',
    title: 'Raid prog & logs',
    blurb: 'Tools for prog groups, statics, and anyone trying to clear current content.',
    links: [
      {
        title: 'FFLogs',
        url: 'https://www.fflogs.com/',
        description: 'Combat logging and rankings. The raid community’s scoreboard.',
      },
      {
        title: 'Hector Hectorson’s Toolbox',
        url: 'https://ff14.toolboxgaming.space/',
        description: 'Visual planning tool for raid markers and mechanics walkthroughs.',
      },
      {
        title: 'Heavenswhere',
        url: 'https://heavenswhere.com/',
        description: 'Fight planner with timeline view — great for callouts and reviews.',
      },
    ],
  },
  {
    id: 'craft-gather',
    title: 'Crafting & gathering',
    blurb: 'For the DoH/DoL crowd — collectables, melds, and macros.',
    links: [
      {
        title: 'Teamcraft',
        url: 'https://ffxivteamcraft.com/',
        description: 'The crafter’s Swiss army knife — rotations, gear, supply schedules.',
      },
      {
        title: 'Garland Tools',
        url: 'https://garlandtools.org/',
        description: 'Item database with node maps for every gatherable in the game.',
      },
      {
        title: 'Universalis',
        url: 'https://universalis.app/',
        description: 'Cross-world market board prices and history.',
      },
    ],
  },
  {
    id: 'glam-rp',
    title: 'Glam, housing, RP',
    blurb: 'For the visual-novelist branch of the FFXIV community.',
    links: [
      {
        title: 'Eorzea Collection',
        url: 'https://ffxiv.eorzeacollection.com/',
        description: 'Browse glam ideas tagged by item, job, and aesthetic.',
      },
      {
        title: 'FFXIV Housing',
        url: 'https://ffxiv-housing.com/',
        description: 'Inspiration gallery for FC mansions, personal rooms, and apartments.',
      },
      {
        title: 'Gposers Discord',
        url: 'https://discord.com/invite/gposers',
        description: 'Cross-server gpose and screenshot community.',
      },
    ],
  },
  {
    id: 'alliance',
    title: 'Inside the alliance',
    blurb:
      'Mentorship is run inside the Discord — drop a message in #mentorship and an existing member will help you find a match.',
    links: [
      {
        title: 'The Cactuar Alliance Discord',
        url: 'https://discord.gg/cactuar-alliance',
        description: 'Cross-FC chat, event coordination, mentorship signups.',
      },
      {
        title: 'FC Directory',
        url: '/fcs',
        description: 'Every member FC with live Lodestone data and recruiting status.',
      },
      {
        title: 'Find your FC',
        url: '/find-your-fc',
        description: 'Four-question matching quiz to surface FCs that fit you.',
      },
    ],
  },
];
