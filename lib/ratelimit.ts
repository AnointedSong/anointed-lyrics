import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only initialise if Upstash env vars are present
// Falls back to no-op in development if not configured
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 requests per 60 seconds per user
    analytics: true,
    prefix: 'anointedlyrics:ratelimit',
  });
}

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  if (!ratelimit) {
    // No Upstash configured — allow in dev
    return { allowed: true, remaining: 99, reset: 0 };
  }

  const { success, remaining, reset } = await ratelimit.limit(userId);
  return { allowed: success, remaining, reset };
}
