// Simple in-memory cache implementation (no Redis required)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<any>>();

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);
  
  // Check if cache entry exists and is still valid
  if (cached && (now - cached.timestamp) < (cached.ttl * 1000)) {
    return cached.data;
  }
  
  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  cache.set(key, {
    data,
    timestamp: now,
    ttl: ttlSeconds
  });
  
  // Clean up expired entries periodically
  if (cache.size > 100) {
    for (const [cacheKey, entry] of cache.entries()) {
      if ((now - entry.timestamp) >= (entry.ttl * 1000)) {
        cache.delete(cacheKey);
      }
    }
  }
  
  return data;
}