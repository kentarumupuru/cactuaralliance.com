/**
 * Base fetcher pointed at the ca-proxy Worker.
 * Worker URL is set via VITE_PROXY_URL (defaults to local Wrangler dev).
 */

const PROXY_URL: string =
  import.meta.env.VITE_PROXY_URL ?? 'http://localhost:8787';

export class ProxyError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
  ) {
    super(message);
    this.name = 'ProxyError';
  }
}

export async function proxyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${PROXY_URL}${path}`;
  const res = await fetch(url, init);

  if (!res.ok && res.status !== 206) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) detail = body.error;
    } catch {
      // body wasn't JSON — leave detail as statusText
    }
    throw new ProxyError(detail, res.status, url);
  }

  return (await res.json()) as T;
}
