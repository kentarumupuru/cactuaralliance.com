/**
 * ca-proxy — Cloudflare Worker fronting the Cactuar Alliance frontend.
 *
 * Endpoints:
 *   GET /fcs           → FC roster from the published Google Sheet (Milestone 5)
 *   GET /fc/:id        → Live FC stats scraped from FFXIV Lodestone (Milestone 6)
 *
 * For now (Milestone 4) /fcs returns a hardcoded fixture so the frontend can
 * wire up react-query end-to-end against a real CORS-gated origin.
 */

import { FIXTURE_FCS } from './fixtures';
import { forbidden, isAllowedOrigin, jsonResponse, notFound, preflight } from './http';
import type { FCsResponse } from './types';

type LogContext = Record<string, unknown>;

function log(level: 'info' | 'warn' | 'error', msg: string, ctx: LogContext): void {
  // Structured JSON logging — required for Workers observability search.
  const entry = { level, msg, ts: new Date().toISOString(), ...ctx };
  if (level === 'error') console.error(JSON.stringify(entry));
  else if (level === 'warn') console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';
    const url = new URL(request.url);
    const logCtx: LogContext = { method: request.method, path: url.pathname, origin };

    // CORS preflight — answer fast, even before origin check, to surface 403s clearly.
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

    // Route: GET /fcs
    if (url.pathname === '/fcs') {
      try {
        const body: FCsResponse = {
          fcs: [...FIXTURE_FCS],
          fetchedAt: new Date().toISOString(),
        };
        log('info', 'fcs.fixture.served', { ...logCtx, count: body.fcs.length });
        return jsonResponse(body, 200, origin);
      } catch (err) {
        log('error', 'fcs.fixture.error', { ...logCtx, error: String(err) });
        return jsonResponse({ error: 'Internal error' }, 500, origin);
      }
    }

    // Route: GET /fc/:lodestoneId — implemented in Milestone 6.
    const fcMatch = url.pathname.match(/^\/fc\/(\d+)$/);
    if (fcMatch) {
      log('info', 'fc.not_implemented', { ...logCtx, lodestoneId: fcMatch[1] });
      return jsonResponse({ error: 'Not implemented yet' }, 501, origin);
    }

    // Route: GET / — health check
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
