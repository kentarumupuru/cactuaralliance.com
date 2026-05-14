import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFCHTML } from './lodestone';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REAL_HTML = readFileSync(
  join(__dirname, '__fixtures__/fc-fuh.html'),
  'utf-8',
);

describe('parseFCHTML — real Lodestone FC page', () => {
  it('extracts the FC name', () => {
    const fc = parseFCHTML(REAL_HTML);
    expect(fc.freeCompanyName).toBe('Fuh');
  });

  it('extracts the active member count as a number', () => {
    const fc = parseFCHTML(REAL_HTML);
    expect(fc.memberCount).toBe(3);
  });

  it('extracts the grand company alignment', () => {
    const fc = parseFCHTML(REAL_HTML);
    expect(fc.grandCompany).toContain('Twin Adder');
  });

  it('extracts crest image URLs (1-3 layered images)', () => {
    const fc = parseFCHTML(REAL_HTML);
    expect(fc.crestUrls.length).toBeGreaterThan(0);
    expect(fc.crestUrls.length).toBeLessThanOrEqual(3);
    for (const url of fc.crestUrls) {
      expect(url).toMatch(/^https:\/\/img2\.finalfantasyxiv\.com\/c\//);
    }
  });

  it('returns a string for active hours (even when "Not specified")', () => {
    const fc = parseFCHTML(REAL_HTML);
    expect(typeof fc.active).toBe('string');
    // Real FC has "Not specified" — should be normalized, not include HTML
    expect(fc.active).not.toContain('<');
  });

  it('returns an empty slogan when the FC has no message', () => {
    const fc = parseFCHTML(REAL_HTML);
    expect(fc.slogan).toBe('');
  });
});

describe('parseFCHTML — synthetic edge cases', () => {
  it('returns empty crestUrls when no crest images present', () => {
    const html = `
      <div class="entry__freecompany__crest__image">
      </div>
      <p class="freecompany__text__name">Test FC</p>
      <h3 class="heading--lead">Active Members</h3>
      <p class="freecompany__text">42</p>
    `;
    const fc = parseFCHTML(html);
    expect(fc.crestUrls).toEqual([]);
  });

  it('extracts a slogan with HTML entities decoded', () => {
    const html = `
      <p class="freecompany__text__name">Test FC</p>
      <h3 class="heading--lead">Company Slogan</h3>
      <p class="freecompany__text freecompany__text__message">Hello &amp; welcome &laquo;adventurer&raquo;</p>
      <h3 class="heading--lead">Active Members</h3>
      <p class="freecompany__text">100</p>
    `;
    const fc = parseFCHTML(html);
    expect(fc.slogan).toBe('Hello & welcome «adventurer»');
  });

  it('parses member count even when surrounded by whitespace', () => {
    const html = `
      <p class="freecompany__text__name">Test FC</p>
      <h3 class="heading--lead">Active Members</h3>
      <p class="freecompany__text">
        128
      </p>
    `;
    const fc = parseFCHTML(html);
    expect(fc.memberCount).toBe(128);
  });

  it('defaults memberCount to 0 when absent', () => {
    const html = '<p class="freecompany__text__name">Empty FC</p>';
    const fc = parseFCHTML(html);
    expect(fc.memberCount).toBe(0);
  });

  it('defaults freeCompanyName to empty string when absent', () => {
    const html = '<p>nothing relevant</p>';
    const fc = parseFCHTML(html);
    expect(fc.freeCompanyName).toBe('');
  });

  it('extracts multiple crest URLs in document order', () => {
    const html = `
      <div class="entry__freecompany__crest__image">
        <img src="https://img2.finalfantasyxiv.com/c/A_aaa.png" width="64" height="64">
        <img src="https://img2.finalfantasyxiv.com/c/B_bbb.png" width="64" height="64">
        <img src="https://img2.finalfantasyxiv.com/c/C_ccc.png" width="64" height="64">
      </div>
      <p class="freecompany__text__name">X</p>
      <h3 class="heading--lead">Active Members</h3>
      <p class="freecompany__text">1</p>
    `;
    const fc = parseFCHTML(html);
    expect(fc.crestUrls).toEqual([
      'https://img2.finalfantasyxiv.com/c/A_aaa.png',
      'https://img2.finalfantasyxiv.com/c/B_bbb.png',
      'https://img2.finalfantasyxiv.com/c/C_ccc.png',
    ]);
  });

  it('returns undefined grand company when not present', () => {
    const html = `
      <p class="freecompany__text__name">No GC</p>
      <h3 class="heading--lead">Active Members</h3>
      <p class="freecompany__text">5</p>
    `;
    const fc = parseFCHTML(html);
    expect(fc.grandCompany).toBeUndefined();
  });
});
