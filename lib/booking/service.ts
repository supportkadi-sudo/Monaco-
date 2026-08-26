import { BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/db';
import { visitDateToDate } from '@/lib/date';
import type { BookingInput } from '@/lib/validation/booking';

export const allowedStatuses = new Set<BookingStatus>([
  BookingStatus.NEW,
  BookingStatus.CONTACTED,
  BookingStatus.CONFIRMED,
  BookingStatus.CANCELLED
]);

export async function createBooking(input: BookingInput) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        name: input.name,
        phone: input.phone,
        telegram: input.telegram || null,
        visitDate: visitDateToDate(input.visitDate),
        adults: input.adults,
        children: input.children,
        comment: input.comment || null
      }
    });

    return tx.booking.update({
      where: { id: booking.id },
      data: { publicId: String(1000 + booking.id) }
    });
  });
}

export async function updateBookingStatus(id: number, status: BookingStatus) {
  if (!allowedStatuses.has(status)) throw new Error('Invalid booking status');
  return prisma.booking.update({
    where: { id },
    data: { status },
    include: { telegramMessages: true }
  });
}
