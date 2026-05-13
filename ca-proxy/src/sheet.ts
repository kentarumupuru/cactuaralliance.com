import { parseCSV } from './csv';
import { rowsToFCs, type SheetRow } from './fc-mapper';
import type { FC } from './types';

const SHEET_URL_TEMPLATE = (id: string, gid: string): string =>
  `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;

const UA =
  'Mozilla/5.0 (compatible; ca-proxy/1.0; +https://cactuaralliance.com)';

/**
 * Fetches the published Google Sheet that lists member FCs and returns a
 * validated FC[]. Throws on transport / non-2xx so the caller can decide
 * whether to fall back to a cached value.
 */
export async function fetchFCsFromSheet(sheetId: string, gid: string): Promise<FC[]> {
  if (!sheetId || sheetId.startsWith('REPLACE_')) {
    throw new Error('SHEET_ID is not configured');
  }

  const url = SHEET_URL_TEMPLATE(sheetId, gid);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });

  if (!res.ok) {
    throw new Error(`Sheet fetch failed: HTTP ${res.status}`);
  }

  const text = await res.text();
  const rows = parseCSV(text) as SheetRow[];
  return rowsToFCs(rows);
}
