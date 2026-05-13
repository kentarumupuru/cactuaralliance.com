import type { Activity, Experience, FC, Playstyle, Tz } from './types';

/**
 * Shape of a CSV row from the published Google Sheet (after parseCSV).
 * Keys mirror the sheet schema documented in the implementation plan.
 */
export interface SheetRow {
  name?: string;
  tag?: string;
  lodestone_id?: string;
  blurb?: string;
  description?: string;
  recruiting?: string;
  playstyle?: string;
  activities?: string;
  schedule_tz?: string;
  weekend_focus?: string;
  weeknight_focus?: string;
  experience_welcome?: string;
  mentorship_offered?: string;
  discord_invite?: string;
  featured?: string;
  notes?: string;
}

const PLAYSTYLES: ReadonlySet<Playstyle> = new Set(['casual', 'mid-core', 'hardcore']);
const TIMEZONES: ReadonlySet<Tz> = new Set(['NA-east', 'NA-west', 'EU', 'OCE', 'mixed']);
const ACTIVITIES: ReadonlySet<Activity> = new Set([
  'raid',
  'craft',
  'rp',
  'pvp',
  'social',
  'treasure-hunt',
  'glam',
  'housing',
  'roulettes',
]);
const EXPERIENCES: ReadonlySet<Experience> = new Set(['sprout', 'returning', 'veteran']);

const TRUTHY: ReadonlySet<string> = new Set(['yes', 'y', 'true', '1', 't']);

export function rowsToFCs(rows: readonly SheetRow[]): FC[] {
  const out: FC[] = [];
  for (const row of rows) {
    const fc = rowToFC(row);
    if (fc) out.push(fc);
  }
  return out;
}

function rowToFC(row: SheetRow): FC | null {
  const name = trimOrEmpty(row.name);
  const lodestoneId = trimOrEmpty(row.lodestone_id);

  // Required fields: name and a numeric lodestone_id.
  if (!name) return null;
  if (!lodestoneId || !/^\d+$/.test(lodestoneId)) return null;

  const playstyleRaw = trimOrEmpty(row.playstyle).toLowerCase();
  const playstyle: Playstyle = PLAYSTYLES.has(playstyleRaw as Playstyle)
    ? (playstyleRaw as Playstyle)
    : 'casual';

  const tzRaw = trimOrEmpty(row.schedule_tz);
  const scheduleTz: Tz = TIMEZONES.has(tzRaw as Tz) ? (tzRaw as Tz) : 'mixed';

  const discordInvite = trimOrEmpty(row.discord_invite);
  const notes = trimOrEmpty(row.notes);

  const fc: FC = {
    name,
    tag: trimOrEmpty(row.tag),
    lodestoneId,
    blurb: trimOrEmpty(row.blurb),
    description: trimOrEmpty(row.description),
    recruiting: parseBool(row.recruiting),
    playstyle,
    activities: parseEnumList(row.activities, ACTIVITIES) as Activity[],
    scheduleTz,
    weekendFocus: parseBool(row.weekend_focus),
    weeknightFocus: parseBool(row.weeknight_focus),
    experienceWelcome: parseEnumList(row.experience_welcome, EXPERIENCES) as Experience[],
    mentorshipOffered: parseStringList(row.mentorship_offered),
    featured: parseBool(row.featured),
  };

  if (discordInvite) fc.discordInvite = discordInvite;
  if (notes) fc.notes = notes;

  return fc;
}

function trimOrEmpty(v: string | undefined): string {
  return (v ?? '').trim();
}

function parseBool(v: string | undefined): boolean {
  return TRUTHY.has(trimOrEmpty(v).toLowerCase());
}

function parseStringList(v: string | undefined): string[] {
  const raw = trimOrEmpty(v);
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of raw.split(',')) {
    const trimmed = token.trim().toLowerCase();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      out.push(trimmed);
    }
  }
  return out;
}

function parseEnumList<T extends string>(v: string | undefined, allowed: ReadonlySet<T>): T[] {
  const raw = trimOrEmpty(v);
  if (!raw) return [];
  const seen = new Set<T>();
  const out: T[] = [];
  for (const token of raw.split(',')) {
    const trimmed = token.trim().toLowerCase() as T;
    if (allowed.has(trimmed) && !seen.has(trimmed)) {
      seen.add(trimmed);
      out.push(trimmed);
    }
  }
  return out;
}
