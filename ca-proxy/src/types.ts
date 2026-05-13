/**
 * Wire format for /fcs and /fc/:id responses.
 * Mirrors src/types.ts on the frontend — keep these in sync.
 */

export type Playstyle = 'casual' | 'mid-core' | 'hardcore';

export type Activity =
  | 'raid'
  | 'craft'
  | 'rp'
  | 'pvp'
  | 'social'
  | 'treasure-hunt'
  | 'glam'
  | 'housing'
  | 'roulettes';

export type Tz = 'NA-east' | 'NA-west' | 'EU' | 'OCE' | 'mixed';

export type Experience = 'sprout' | 'returning' | 'veteran';

export interface FC {
  name: string;
  tag: string;
  lodestoneId: string;
  blurb: string;
  description: string;
  recruiting: boolean;
  playstyle: Playstyle;
  activities: Activity[];
  scheduleTz: Tz;
  weekendFocus: boolean;
  weeknightFocus: boolean;
  experienceWelcome: Experience[];
  mentorshipOffered: string[];
  discordInvite?: string;
  featured: boolean;
  notes?: string;
}

export interface LodestoneFC {
  crestUrls: string[];
  memberCount: number;
  slogan: string;
  grandCompany?: string;
  freeCompanyName: string;
  active: string;
}

export interface FCsResponse {
  fcs: FC[];
  fetchedAt: string;
}

export interface FCProfileResponse {
  lodestone: LodestoneFC | null;
  fetchedAt: string;
}

export interface ErrorResponse {
  error: string;
}
