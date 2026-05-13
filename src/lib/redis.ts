import { Redis } from '@upstash/redis'
import { env } from '@/env'

// ─── Client ───────────────────────────────────────────────────────────────────

let redis: Redis | null = null

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export { redis }

// ─── TTL constants (seconds) ──────────────────────────────────────────────────

export const CACHE_TTL = {
  BLOG_LIST: 300,       // 5 phút  – danh sách bài viết
  BLOG_DETAIL: 3600,    // 1 giờ   – chi tiết bài viết
  TAGS: 600,            // 10 phút – danh sách tag
  LEADERBOARD: 300,     // 5 phút  – bảng xếp hạng
  SUGGESTED: 1800,      // 30 phút – bài viết gợi ý
  SEARCH: 60,           // 1 phút  – kết quả tìm kiếm
  COMMENTS: 120,        // 2 phút  – bình luận
  VIEWS: 60,            // 1 phút  – view count realtime
  TAG_DETAIL: 600,      // 10 phút – tag detail + blogs
} as const

// ─── Cache read/write ─────────────────────────────────────────────────────────

/**
 * Đọc từ cache Redis trước, nếu miss thì gọi fetcher rồi lưu lại.
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  if (!redis) return fetcher()

  const cached = await redis.get<T>(key)
  if (cached !== null && cached !== undefined) return cached

  const data = await fetcher()
  // Dùng pipeline để set + expire atomic
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

// ─── Pattern-based invalidation ──────────────────────────────────────────────

/**
 * Xóa tất cả key khớp với pattern (Upstash REST không hỗ trợ DEL với wildcard
 * nên phải SCAN + DEL từng batch).
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  if (!redis) return

  let cursor = 0
  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: pattern,
      count: 100,
    })
    cursor = Number(nextCursor)

    if (keys.length > 0) {
      // Upstash pipeline để xóa batch
      const pipeline = redis.pipeline()
      for (const key of keys) pipeline.del(key)
      await pipeline.exec()
    }
  } while (cursor !== 0)
}

/**
 * Xóa nhiều pattern cùng lúc (dùng khi tạo/sửa/xóa bài viết).
 */
export async function invalidatePatterns(patterns: string[]): Promise<void> {
  if (!redis) return
  await Promise.all(patterns.map(invalidatePattern))
}

// ─── View counter (Redis-first, sync DB async) ────────────────────────────────

const VIEW_KEY = (slug: string) => `views:${slug}`

/**
 * Tăng view count trong Redis (INCR) và trả về giá trị mới.
 * Đặt TTL khi key được tạo lần đầu (không override TTL nếu key đã tồn tại).
 */
export async function incrementViewInRedis(slug: string): Promise<number | null> {
  if (!redis) return null

  const key = VIEW_KEY(slug)
  const newCount = await redis.incr(key)

  // Chỉ set expire lần đầu (khi count = 1)
  if (newCount === 1) {
    await redis.expire(key, CACHE_TTL.VIEWS)
  }

  return newCount
}

/**
 * Lấy view count từ Redis (dùng cho realtime display).
 * Trả về null nếu Redis không khả dụng hoặc key chưa có.
 */
export async function getViewFromRedis(slug: string): Promise<number | null> {
  if (!redis) return null
  const val = await redis.get<number>(VIEW_KEY(slug))
  return val !== null ? Number(val) : null
}

// ─── Batch view sync (dùng cho cron job hoặc background sync) ────────────────

/**
 * Lấy tất cả view keys đang pending sync về DB.
 * Trả về map: slug → views
 */
export async function getPendingViewCounts(): Promise<Record<string, number>> {
  if (!redis) return {}

  const result: Record<string, number> = {}
  let cursor = 0

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: 'views:*',
      count: 100,
    })
    cursor = Number(nextCursor)

    if (keys.length > 0) {
      const pipeline = redis.pipeline()
      for (const key of keys) pipeline.get(key)
      const values = await pipeline.exec()

      keys.forEach((key, i) => {
        const slug = key.replace('views:', '')
        result[slug] = Number(values[i]) || 0
      })
    }
  } while (cursor !== 0)

  return result
}
