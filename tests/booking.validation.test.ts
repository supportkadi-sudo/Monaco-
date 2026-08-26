import { describe, expect, it } from 'vitest';
import { bookingInputSchema } from '@/lib/validation/booking';

describe('bookingInputSchema', () => {
  it('normalizes a valid Uzbek phone and accepts guests', () => {
    const result = bookingInputSchema.parse({
      name: 'Тестовый гость',
      phone: '998 90 123 45 67',
      visitDate: '2099-01-10',
      adults: 2,
      children: 1,
      comment: ''
    });
    expect(result.phone).toBe('+998901234567');
    expect(result.adults + result.children).toBe(3);
  });

  it('rejects invalid phone, empty party and honeypot', () => {
    expect(() => bookingInputSchema.parse({
      name: 'A', phone: '123', visitDate: '2099-01-10', adults: 0, children: 0, website: 'spam'
    })).toThrow();
  });
});
