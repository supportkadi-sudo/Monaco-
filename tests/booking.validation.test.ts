import { describe, expect, it } from 'vitest';
import { bookingInputSchema } from '@/lib/validation/booking';

describe('bookingInputSchema', () => {
  it('normalizes valid Uzbek phone and Telegram contact', () => {
    const result = bookingInputSchema.parse({
      name: 'Тестовый гость',
      phone: '998 90 123 45 67',
      telegram: 'https://t.me/monaco_guest',
      visitDate: '2099-01-10',
      adults: 2,
      children: 1,
      comment: ''
    });
    expect(result.phone).toBe('+998901234567');
    expect(result.telegram).toBe('@monaco_guest');
    expect(result.adults + result.children).toBe(3);
  });

  it('keeps Telegram optional', () => {
    const result = bookingInputSchema.parse({
      name: 'Тестовый гость',
      phone: '+998901234567',
      visitDate: '2099-01-10',
      adults: 1,
      children: 0
    });
    expect(result.telegram).toBe('');
  });

  it('rejects an invalid Telegram username', () => {
    expect(() => bookingInputSchema.parse({
      name: 'Тестовый гость',
      phone: '+998901234567',
      telegram: '@bad name',
      visitDate: '2099-01-10',
      adults: 1,
      children: 0
    })).toThrow();
  });

  it('rejects invalid phone, empty party and honeypot', () => {
    expect(() => bookingInputSchema.parse({
      name: 'A', phone: '123', visitDate: '2099-01-10', adults: 0, children: 0, website: 'spam'
    })).toThrow();
  });
});
