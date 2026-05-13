import { describe, expect, it } from 'vitest';
import { parseCSV } from './csv';

describe('parseCSV', () => {
  it('parses a simple two-row file with a header', () => {
    const input = 'name,tag\nMoonlighters,MOON\nSun-Warmed,SUN';
    expect(parseCSV(input)).toEqual([
      { name: 'Moonlighters', tag: 'MOON' },
      { name: 'Sun-Warmed', tag: 'SUN' },
    ]);
  });

  it('returns an empty array when only a header is present', () => {
    expect(parseCSV('name,tag\n')).toEqual([]);
  });

  it('returns an empty array on empty input', () => {
    expect(parseCSV('')).toEqual([]);
    expect(parseCSV('   \n  \n')).toEqual([]);
  });

  it('handles quoted fields containing commas', () => {
    const input = 'name,blurb\nMoonlighters,"Social, weekend raids, good vibes"';
    expect(parseCSV(input)).toEqual([
      { name: 'Moonlighters', blurb: 'Social, weekend raids, good vibes' },
    ]);
  });

  it('handles quoted fields containing newlines', () => {
    const input = 'name,description\nFC,"line 1\nline 2"';
    expect(parseCSV(input)).toEqual([{ name: 'FC', description: 'line 1\nline 2' }]);
  });

  it('handles escaped double-quotes inside quoted fields', () => {
    const input = 'name,blurb\nFC,"They said ""hello"" loudly"';
    expect(parseCSV(input)).toEqual([{ name: 'FC', blurb: 'They said "hello" loudly' }]);
  });

  it('trims unquoted field whitespace but preserves whitespace inside quotes', () => {
    const input = 'name,note\n  FC  ,"  inside  "';
    expect(parseCSV(input)).toEqual([{ name: 'FC', note: '  inside  ' }]);
  });

  it('handles trailing empty fields', () => {
    const input = 'name,tag,notes\nFC,FCC,';
    expect(parseCSV(input)).toEqual([{ name: 'FC', tag: 'FCC', notes: '' }]);
  });

  it('handles leading empty fields', () => {
    const input = 'name,tag,notes\n,FCC,a note';
    expect(parseCSV(input)).toEqual([{ name: '', tag: 'FCC', notes: 'a note' }]);
  });

  it('skips fully blank rows', () => {
    const input = 'name,tag\nFC,FCC\n\n  \nFC2,FCD';
    expect(parseCSV(input)).toEqual([
      { name: 'FC', tag: 'FCC' },
      { name: 'FC2', tag: 'FCD' },
    ]);
  });

  it('handles CRLF line endings (Google Sheets exports use these)', () => {
    const input = 'name,tag\r\nMoonlighters,MOON\r\nSpires,SUN\r\n';
    expect(parseCSV(input)).toEqual([
      { name: 'Moonlighters', tag: 'MOON' },
      { name: 'Spires', tag: 'SUN' },
    ]);
  });

  it('handles a trailing newline without producing an empty row', () => {
    expect(parseCSV('name\nFC\n')).toEqual([{ name: 'FC' }]);
  });

  it('handles rows with fewer cells than the header (missing trailing columns)', () => {
    const input = 'name,tag,notes\nFC,FCC';
    expect(parseCSV(input)).toEqual([{ name: 'FC', tag: 'FCC', notes: '' }]);
  });

  it('ignores extra cells beyond the header width', () => {
    const input = 'name,tag\nFC,FCC,extra,ignored';
    expect(parseCSV(input)).toEqual([{ name: 'FC', tag: 'FCC' }]);
  });

  it('normalizes header keys to lowercase trimmed strings', () => {
    const input = '  Name  ,TAG\nFC,FCC';
    expect(parseCSV(input)).toEqual([{ name: 'FC', tag: 'FCC' }]);
  });
});
