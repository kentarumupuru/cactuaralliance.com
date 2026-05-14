/**
 * ca-proxy — Cloudflare Worker fronting the Cactuar Alliance frontend.
 *
 * Endpoints:
 *   GET /            → health check
 *   GET /fcs         → FC roster from the published Google Sheet (KV-cached, 10min)
 *   GET /fc/:id      → Live FC stats scraped from FFXIV Lodestone (Milestone 6)
 */

import { getCached, putCached } from './cache';
import { FIXTURE_FCS } from './fixtures';
import { forbidden, isAllowedOrigin, jsonResponse, notFound, preflight } from './http';
import { scrapeLodestoneFC } from './lodestone';
import { fetchFCsFromSheet } from './sheet';
import type { FC, FCProfileResponse, FCsResponse, LodestoneFC } from './types';

type LogContext = Record<string, unknown>;

function log(level: 'info' | 'warn' | 'error', msg: string, ctx: LogContext): void {
  const entry = { level, msg, ts: new Date().toISOString(), ...ctx };
  if (level === 'error') console.error(JSON.stringify(entry));
  else if (level === 'warn') console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

const FCS_CACHE_KEY = 'fcs:v1';
const FCS_TTL_SECONDS = 10 * 60; // 10 minutes

const FC_CACHE_KEY = (id: string): string => `fc:v1:${id}`;
const FC_TTL_SECONDS = 6 * 60 * 60; // 6 hours

async function getFC(
  env: Env,
  lodestoneId: string,
  logCtx: LogContext,
): Promise<{ fc: LodestoneFC | null; source: 'cache' | 'lodestone' | 'failed'; cachedAt?: string }> {
  const key = FC_CACHE_KEY(lodestoneId);

  const cached = await getCached<LodestoneFC>(env.CA_CACHE, key);
  if (cached) {
    log('info', 'fc.cache.hit', { ...logCtx, lodestoneId, cachedAt: cached.cachedAt });
    return { fc: cached.data, source: 'cache', cachedAt: cached.cachedAt };
  }

  try {
    const fc = await scrapeLodestoneFC(lodestoneId);
    log('info', 'fc.lodestone.fetched', {
      ...logCtx,
      lodestoneId,
      memberCount: fc.memberCount,
    });
    await putCached(env.CA_CACHE, key, fc, FC_TTL_SECONDS);
    return { fc, source: 'lodestone' };
  } catch (err) {
    log('warn', 'fc.lodestone.failed', { ...logCtx, lodestoneId, error: String(err) });
    return { fc: null, source: 'failed' };
  }
}

async function getFCs(env: Env, logCtx: LogContext): Promise<{
  fcs: FC[];
  source: 'cache' | 'sheet' | 'cache-stale' | 'fixture';
  cachedAt?: string;
}> {
  // 1. Try fresh cache
  const cached = await getCached<FC[]>(env.CA_CACHE, FCS_CACHE_KEY);
  if (cached) {
    log('info', 'fcs.cache.hit', { ...logCtx, cachedAt: cached.cachedAt, count: cached.data.length });
    return { fcs: cached.data, source: 'cache', cachedAt: cached.cachedAt };
  }

  // 2. Cache miss → fetch sheet
  try {
    const fcs = await fetchFCsFromSheet(env.SHEET_ID, env.SHEET_GID);
    log('info', 'fcs.sheet.fetched', { ...logCtx, count: fcs.length });
    // Store the fresh result, but don't block the response on the write.
    await putCached(env.CA_CACHE, FCS_CACHE_KEY, fcs, FCS_TTL_SECONDS);
    return { fcs, source: 'sheet' };
  } catch (err) {
    log('warn', 'fcs.sheet.failed', { ...logCtx, error: String(err) });
    // 3. Sheet fetch failed → fall back to fixture so /fcs always responds.
    return { fcs: [...FIXTURE_FCS], source: 'fixture' };
  }
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';
    const url = new URL(request.url);
    const logCtx: LogContext = { method: request.method, path: url.pathname, origin };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin)) return forbidden(origin);
      return preflight(origin);
    }

    if (!isAllowedOrigin(origin)) {
      log('warn', 'blocked.origin', logCtx);
      return forbidden(origin);
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

    // GET /fcs
    if (url.pathname === '/fcs') {
      try {
        const result = await getFCs(env, logCtx);
        const body: FCsResponse = {
          fcs: result.fcs,
          fetchedAt: result.cachedAt ?? new Date().toISOString(),
        };
        return jsonResponse(body, 200, origin);
      } catch (err) {
        log('error', 'fcs.handler.error', { ...logCtx, error: String(err) });
        return jsonResponse({ error: 'Internal error' }, 500, origin);
      }
    }

    // GET /fc/:lodestoneId
    const fcMatch = url.pathname.match(/^\/fc\/(\d+)$/);
    if (fcMatch) {
      const lodestoneId = fcMatch[1];
      try {
        const result = await getFC(env, lodestoneId, logCtx);
        const body: FCProfileResponse = {
          lodestone: result.fc,
          fetchedAt: result.cachedAt ?? new Date().toISOString(),
        };
        // 206 Partial Content when serving null due to upstream failure — the
        // sheet's blurb/description still render even if live stats are gone.
        const status = result.fc === null ? 206 : 200;
        return jsonResponse(body, status, origin);
      } catch (err) {
        log('error', 'fc.handler.error', { ...logCtx, error: String(err) });
        return jsonResponse({ error: 'Internal error' }, 500, origin);
      }
    }

    // GET / — health check
    if (url.pathname === '/') {
      return jsonResponse(
        { ok: true, name: 'ca-proxy', endpoints: ['/fcs', '/fc/:id'] },
        200,
        origin,
      );
    }

    log('info', 'route.notfound', logCtx);
    return notFound(origin);
  },
} satisfies ExportedHandler<Env>;
