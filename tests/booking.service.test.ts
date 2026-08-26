import { BookingStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  updateTx: vi.fn(),
  update: vi.fn(),
  transaction: vi.fn()
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    $transaction: mocks.transaction,
    booking: { update: mocks.update }
  }
}));

import { createBooking, updateBookingStatus } from '@/lib/booking/service';

describe('booking service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.transaction.mockImplementation(async (callback) => callback({
      booking: { create: mocks.create, update: mocks.updateTx }
    }));
  });

  it('creates a booking and assigns public number', async () => {
    mocks.create.mockResolvedValue({ id: 7 });
    mocks.updateTx.mockResolvedValue({ id: 7, publicId: '1007' });

    const result = await createBooking({
      name: 'Гость',
      phone: '+998901234567',
      visitDate: '2099-01-10',
      adults: 2,
      children: 1,
      comment: '',
      website: ''
    });

    expect(result.publicId).toBe('1007');
    expect(mocks.updateTx).toHaveBeenCalledWith({ where: { id: 7 }, data: { publicId: '1007' } });
  });

  it('updates booking status', async () => {
    mocks.update.mockResolvedValue({ id: 7, status: BookingStatus.CONFIRMED, telegramMessages: [] });
    await updateBookingStatus(7, BookingStatus.CONFIRMED);
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 7 }, data: { status: BookingStatus.CONFIRMED }
    }));
  });
});
