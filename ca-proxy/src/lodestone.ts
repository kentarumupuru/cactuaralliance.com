import type { LodestoneFC } from './types';

const LODESTONE_FC_BASE = 'https://na.finalfantasyxiv.com/lodestone/freecompany';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Fetches an FC's Lodestone page and parses the relevant fields. Throws on
 * transport failure or non-2xx so the caller can decide whether to fall back
 * to a stale cache entry.
 */
export async function scrapeLodestoneFC(lodestoneId: string): Promise<LodestoneFC> {
  if (!/^\d+$/.test(lodestoneId)) {
    throw new Error(`Invalid lodestoneId: ${lodestoneId}`);
  }

  const res = await fetch(`${LODESTONE_FC_BASE}/${lodestoneId}/`, {
    headers: { 'User-Agent': UA },
  });

  if (!res.ok) {
    throw new Error(`Lodestone fetch failed: HTTP ${res.status}`);
  }

  const html = await res.text();
  return parseFCHTML(html);
}

/**
 * Pure parser — exposed for unit testing against captured fixture HTML.
 * Uses regex extraction (no DOM parser available in the Workers runtime).
 */
export function parseFCHTML(html: string): LodestoneFC {
  return {
    freeCompanyName: extractFCName(html),
    crestUrls: extractCrestUrls(html),
    memberCount: extractMemberCount(html),
    slogan: extractSlogan(html),
    grandCompany: extractGrandCompany(html),
    active: extractActive(html),
  };
}

/* -------------------- Field extractors -------------------- */

const FC_NAME_RE = /<p class="freecompany__text__name">([^<]*)</;
function extractFCName(html: string): string {
  const m = FC_NAME_RE.exec(html);
  return m ? decodeEntities(m[1].trim()) : '';
}

// Crest container, then 0-3 <img src="..."> inside it.
const CREST_BLOCK_RE = /<div class="entry__freecompany__crest__image"[^>]*>([\s\S]*?)<\/div>/;
const IMG_SRC_RE = /<img\s+[^>]*src="([^"]+)"/g;
function extractCrestUrls(html: string): string[] {
  const block = CREST_BLOCK_RE.exec(html);
  if (!block) return [];
  const urls: string[] = [];
  let m: RegExpExecArray | null;
  IMG_SRC_RE.lastIndex = 0;
  while ((m = IMG_SRC_RE.exec(block[1])) !== null) {
    urls.push(m[1]);
  }
  return urls.slice(0, 3);
}

// "<h3 class='heading--lead'>Active Members</h3><p class='freecompany__text'>123</p>"
function valueAfterHeading(html: string, label: string): string | undefined {
  const re = new RegExp(
    `<h3 class="heading--lead">${escapeRegex(label)}</h3>\\s*<p class="freecompany__text[^"]*">([\\s\\S]*?)</p>`,
  );
  const m = re.exec(html);
  return m ? stripTags(m[1]).trim() : undefined;
}

function extractMemberCount(html: string): number {
  const raw = valueAfterHeading(html, 'Active Members');
  if (!raw) return 0;
  const n = parseInt(raw.replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function extractSlogan(html: string): string {
  const sloganMatch = /<p class="freecompany__text freecompany__text__message">([\s\S]*?)<\/p>/.exec(
    html,
  );
  if (!sloganMatch) return '';
  return decodeEntities(stripTags(sloganMatch[1])).trim();
}

const GC_RE = /<p class="entry__freecompany__gc">([^<]+)<\/p>/;
function extractGrandCompany(html: string): string | undefined {
  const m = GC_RE.exec(html);
  return m ? decodeEntities(m[1].trim()) : undefined;
}

function extractActive(html: string): string {
  const raw = valueAfterHeading(html, 'Active');
  return raw ? decodeEntities(raw) : 'Not specified';
}

/* -------------------- Helpers -------------------- */

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, '');
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&nbsp;': ' ',
  '&laquo;': '«',
  '&raquo;': '»',
};
function decodeEntities(s: string): string {
  return s
    .replace(/&(?:amp|lt|gt|quot|apos|#39|nbsp|laquo|raquo);/g, (m) => ENTITY_MAP[m] ?? m)
    .replace(/&#(\d+);/g, (_m, n: string) => String.fromCharCode(parseInt(n, 10)));
}
