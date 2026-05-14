import type { FC } from './types';

/**
 * Fallback FC returned when the Worker cannot reach the published Google
 * Sheet. Intentionally obvious — production deploys should configure SHEET_ID
 * in wrangler.jsonc and publish the sheet so this fixture is never served.
 */
export const FIXTURE_FCS: ReadonlyArray<FC> = [
  {
    name: 'Example FC (placeholder)',
    tag: 'EX',
    lodestoneId: '0',
    blurb:
      'Placeholder shown when the Google Sheet has not been configured yet.',
    description:
      'The Worker falls back to this entry when it cannot reach the published Google Sheet (SHEET_ID unset, sheet not published, or upstream error). Configure SHEET_ID in ca-proxy/wrangler.jsonc and publish the sheet to replace this with the real roster.',
    recruiting: false,
    playstyle: 'mid-core',
    activities: [],
    scheduleTz: 'mixed',
    weekendFocus: false,
    weeknightFocus: false,
    experienceWelcome: [],
    mentorshipOffered: [],
    featured: false,
  },
];
