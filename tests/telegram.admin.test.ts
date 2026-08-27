import { describe, expect, it } from 'vitest';
import { isAuthorizedTelegramAdmin } from '@/lib/telegram/admin';

describe('Telegram admin authorization', () => {
  const admins = new Set(['123', '456']);

  it('allows an authorized administrator in a private chat', () => {
    expect(isAuthorizedTelegramAdmin('123', '123', admins)).toBe(true);
  });

  it('rejects unauthorized users and group-chat callbacks', () => {
    expect(isAuthorizedTelegramAdmin('999', '999', admins)).toBe(false);
    expect(isAuthorizedTelegramAdmin('-100777', '123', admins)).toBe(false);
    expect(isAuthorizedTelegramAdmin(undefined, '123', admins)).toBe(false);
  });
});
