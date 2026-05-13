/**
 * KV-backed cache helpers with safe JSON serialization.
 * Wraps env.CA_CACHE so callers don't worry about parse errors or expiry math.
 */

export interface CachedValue<T> {
  data: T;
  cachedAt: string;
}

export async function getCached<T>(kv: KVNamespace, key: string): Promise<CachedValue<T> | null> {
  const raw = await kv.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedValue<T>;
  } catch {
    return null;
  }
}

export async function putCached<T>(
  kv: KVNamespace,
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  const payload: CachedValue<T> = { data: value, cachedAt: new Date().toISOString() };
  await kv.put(key, JSON.stringify(payload), { expirationTtl: ttlSeconds });
}
