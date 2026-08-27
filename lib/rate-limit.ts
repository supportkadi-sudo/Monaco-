type Bucket = { count: number; resetAt: number };

type LimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
};

const bookingBuckets = new Map<string, Bucket>();
const adminLoginBuckets = new Map<string, Bucket>();
let checksSinceCleanup = 0;

function cleanupExpired(now: number) {
  checksSinceCleanup += 1;
  if (checksSinceCleanup < 100) return;
  checksSinceCleanup = 0;

  for (const buckets of [bookingBuckets, adminLoginBuckets]) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }
}

function checkLimit(
  buckets: Map<string, Bucket>,
  keyInput: string,
  maxRequests: number,
  windowMs: number
): LimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const key = keyInput || 'unknown';
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
  }

  current.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

export function checkBookingRateLimit(ip: string) {
  return checkLimit(bookingBuckets, ip, 5, 10 * 60 * 1000);
}

export function checkAdminLoginRateLimit(ip: string) {
  return checkLimit(adminLoginBuckets, ip, 8, 15 * 60 * 1000);
}
