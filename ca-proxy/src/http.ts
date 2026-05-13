/**
 * HTTP helpers — CORS, origin allowlist, JSON responses.
 * Mirrors the pattern in kentarumupuru/lodestone-proxy/src/index.ts.
 */

const ALLOWED_ORIGINS: ReadonlyArray<string> = [
  'https://cactuaralliance.com',
  'https://www.cactuaralliance.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173', // vite preview
];

export function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const url = new URL(origin);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true;
  } catch {
    return false;
  }
  return false;
}

export function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function jsonResponse(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });
}

export function notFound(origin: string): Response {
  return jsonResponse({ error: 'Not found' }, 404, origin);
}

export function forbidden(origin: string): Response {
  // Always include the Origin header on 403 so the browser can read the error body.
  return new Response(JSON.stringify({ error: 'Forbidden' }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin',
    },
  });
}

export function preflight(origin: string): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}
