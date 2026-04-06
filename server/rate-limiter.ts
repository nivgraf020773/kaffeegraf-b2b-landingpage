/**
 * In-Memory Rate Limiter
 * No external dependencies required.
 *
 * Design:
 * - Sliding window counter per (key, action) pair
 * - Automatic cleanup of expired entries to prevent memory leaks
 * - Thread-safe for single-process Node.js
 *
 * B2B_STATUS_SPEC v2 compliance:
 * - Does NOT inspect b2b_status or b2b_access_status
 * - Operates purely on IP address and action identifier
 */

interface RateLimitEntry {
  count: number;
  windowStart: number; // Unix timestamp in ms
}

// Global store: key = `${action}:${ip}`, value = entry
const store = new Map<string, RateLimitEntry>();

// Cleanup interval: remove expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of Array.from(store.entries())) {
    // Remove entries older than 1 hour (generous TTL)
    if (now - entry.windowStart > 60 * 60 * 1000) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/**
 * Check and increment rate limit counter.
 *
 * @param action  Identifier for the action being rate-limited (e.g. "b2b.login")
 * @param ip      Client IP address
 * @param config  Rate limit configuration
 * @returns `{ allowed: boolean; remaining: number; resetAt: number }`
 */
export function checkRateLimit(
  action: string,
  ip: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = `${action}:${ip}`;
  const existing = store.get(key);

  if (!existing || now - existing.windowStart >= config.windowMs) {
    // New window — reset counter
    store.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Within existing window
  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.windowStart + config.windowMs,
    };
  }

  // Increment counter
  existing.count += 1;
  store.set(key, existing);
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.windowStart + config.windowMs,
  };
}

/**
 * Pre-configured rate limit policies per endpoint.
 *
 * Thresholds per B2B_STATUS_SPEC v2 / Phase 7 spec:
 * - contact.submit:      5 req / 15 min / IP
 * - b2b.accessRequest:   5 req / 15 min / IP
 * - b2b.login:           5 attempts / 15 min / IP
 */
export const RATE_LIMIT_POLICIES: Record<string, RateLimitConfig> = {
  "contact.submit": {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  "b2b.accessRequest": {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  "b2b.login": {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

/**
 * Exact German error message for rate-limited responses.
 * Must not be changed per spec.
 */
export const RATE_LIMIT_MESSAGE =
  "Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in einigen Minuten erneut.";
