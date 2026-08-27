import { describe, expect, it } from 'vitest';
import { telegramProfileUrl } from '@/lib/telegram/contact';

describe('telegramProfileUrl', () => {
  it('builds a link only for a valid normalized Telegram handle', () => {
    expect(telegramProfileUrl('@monaco_test')).toBe('https://t.me/monaco_test');
    expect(telegramProfileUrl('monaco_test')).toBeNull();
    expect(telegramProfileUrl('@bad')).toBeNull();
    expect(telegramProfileUrl(null)).toBeNull();
  });
});
