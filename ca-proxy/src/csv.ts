/**
 * Minimal RFC 4180-aware CSV parser. Used to parse the published Google Sheet
 * export which uses CRLF line endings and may contain commas, newlines, and
 * escaped double-quotes inside quoted fields.
 *
 * Returns an array of objects keyed by lowercase-trimmed header names.
 * Cells beyond the header width are discarded; missing trailing cells are
 * filled with empty strings.
 */

export function parseCSV(text: string): Record<string, string>[] {
  if (!text.trim()) return [];

  const rows = tokenize(text);
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const out: Record<string, string>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // Skip rows that are entirely empty cells (Sheets often pads with these).
    if (row.every((cell) => cell.trim() === '')) continue;

    const record: Record<string, string> = {};
    for (let j = 0; j < header.length; j++) {
      record[header[j]] = row[j] ?? '';
    }
    out.push(record);
  }

  return out;
}

/**
 * Stream-style tokenizer. Walks character-by-character so quoted fields can
 * contain commas, embedded newlines, and "" escape sequences.
 *
 * Unquoted fields have surrounding whitespace trimmed; quoted fields preserve
 * their interior whitespace exactly.
 */
function tokenize(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  let wasQuoted = false;

  const pushCell = (): void => {
    row.push(wasQuoted ? cell : cell.trim());
    cell = '';
    wasQuoted = false;
  };

  const pushRow = (): void => {
    pushCell();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        // Escaped quote: "" → literal "
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      wasQuoted = true;
      continue;
    }

    if (c === ',') {
      pushCell();
      continue;
    }

    if (c === '\r') {
      // CRLF — consume the \n in the next iteration's check
      if (text[i + 1] === '\n') i++;
      pushRow();
      continue;
    }

    if (c === '\n') {
      pushRow();
      continue;
    }

    cell += c;
  }

  // Flush the final cell/row if the file doesn't end with a newline.
  if (cell !== '' || row.length > 0) {
    pushRow();
  }

  return rows;
}
