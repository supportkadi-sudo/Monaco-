import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ findUnique: vi.fn() }));

vi.mock('@/lib/db', () => ({
  prisma: { adminUser: { findUnique: mocks.findUnique } }
}));

import { verifyAdminCredentials } from '@/lib/admin/credentials';

describe('admin credentials', () => {
  beforeEach(() => vi.clearAllMocks());

  it('accepts the correct password and normalizes email', async () => {
    const passwordHash = await hash('secret-password', 4);
    mocks.findUnique.mockResolvedValue({ id: 'admin-1', email: 'admin@example.com', passwordHash });

    const admin = await verifyAdminCredentials(' ADMIN@EXAMPLE.COM ', 'secret-password');
    expect(admin?.id).toBe('admin-1');
    expect(mocks.findUnique).toHaveBeenCalledWith({ where: { email: 'admin@example.com' } });
  });

  it('rejects a wrong password', async () => {
    const passwordHash = await hash('secret-password', 4);
    mocks.findUnique.mockResolvedValue({ id: 'admin-1', email: 'admin@example.com', passwordHash });
    expect(await verifyAdminCredentials('admin@example.com', 'wrong')).toBeNull();
  });
});
