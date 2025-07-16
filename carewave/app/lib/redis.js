// lib/redis.js
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedData(key, fetchFn, ttl = 300) {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const data = await fetchFn();
    await redis.set(key, JSON.stringify(data), 'EX', ttl); // Cache for 5 minutes
    return data;
  } catch (error) {
    console.error('Redis cache error:', error);
    return fetchFn(); // Fallback to fetch if cache fails
  }
}

export async function invalidateCache(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis invalidate error:', error);
  }
}