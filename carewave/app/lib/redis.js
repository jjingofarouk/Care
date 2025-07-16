// lib/redis.js (updated)
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedData(key, fetchFn, ttl = 300) {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log('Cache hit for:', key);
      return JSON.parse(cached);
    }

    console.log('Cache miss for:', key);
    const data = await fetchFn();
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    return data;
  } catch (error) {
    console.error('Redis cache error:', error);
    return fetchFn(); // Fallback to fetch if cache fails
  }
}

export async function invalidateCache(key) {
  try {
    const deletedCount = await redis.del(key);
    console.log(`Invalidated cache for ${key}, deleted: ${deletedCount}`);
  } catch (error) {
    console.error('Redis invalidate error:', error);
  }
}

export async function invalidateCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      const deletedCount = await redis.del(...keys);
      console.log(`Invalidated ${deletedCount} cache entries matching pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('Redis invalidate pattern error:', error);
  }
}