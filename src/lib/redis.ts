import { Redis } from '@upstash/redis'
import { env } from '@/env'

let redis: Redis | null = null

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export { redis }

export const CACHE_TTL = {
  BLOG_LIST: 300,
  BLOG_DETAIL: 3600,
  TAGS: 600,
  LEADERBOARD: 300,
} as const

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  if (!redis) return fetcher()
  
  const cached = await redis.get<T>(key)
  if (cached) return cached

  const data = await fetcher()
  await redis.setex(key, ttl, data)
  return data
}
