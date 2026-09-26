/**
 * Fixed-window rate limiter kept in process memory.
 *
 * Adequate for a single server instance. On serverless or multi-instance
 * hosting, replace the store with a shared one (e.g. Redis/Upstash) behind
 * the same function signature.
 */
type Window = { count: number; resetAt: number }
const store = new Map<string, Window>()

export function rateLimit(key: string, limit: number, windowMs: number, now: number = Date.now()): { allowed: boolean; retryAfterMs: number } {
  const current = store.get(key)
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterMs: 0 }
  }
  if (current.count >= limit) return { allowed: false, retryAfterMs: current.resetAt - now }
  current.count++
  return { allowed: true, retryAfterMs: 0 }
}

/** Test helper. */
export function resetRateLimits() {
  store.clear()
}
