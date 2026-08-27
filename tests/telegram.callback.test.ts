import { BookingStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { parseBookingCallback } from '@/lib/telegram/callback';

describe('Telegram booking callbacks', () => {
  it('parses an authorized booking status action', () => {
    expect(parseBookingCallback('booking:CONTACTED:42')).toEqual({
      status: BookingStatus.CONTACTED,
      bookingId: 42
    });
  });

  it('rejects unknown status and malformed callback', () => {
    expect(parseBookingCallback('booking:PAID:42')).toBeNull();
    expect(parseBookingCallback('hello')).toBeNull();
  });
});
