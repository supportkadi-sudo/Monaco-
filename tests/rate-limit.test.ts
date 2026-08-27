import { describe, expect, it } from 'vitest';
import { checkAdminLoginRateLimit, checkBookingRateLimit } from '@/lib/rate-limit';

describe('rate limits', () => {
  it('limits repeated booking submissions per IP', () => {
    const key = `booking-${Date.now()}-${Math.random()}`;
    for (let index = 0; index < 5; index += 1) {
      expect(checkBookingRateLimit(key).ok).toBe(true);
    }
    expect(checkBookingRateLimit(key).ok).toBe(false);
  });

  it('limits repeated admin login attempts per IP', () => {
    const key = `login-${Date.now()}-${Math.random()}`;
    for (let index = 0; index < 8; index += 1) {
      expect(checkAdminLoginRateLimit(key).ok).toBe(true);
    }
    expect(checkAdminLoginRateLimit(key).ok).toBe(false);
  });
});
