import { BookingStatus } from '@prisma/client';

const callbackPattern = /^booking:(CONTACTED|CONFIRMED|CANCELLED):(\d+)$/;

export function parseBookingCallback(data: string) {
  const match = data.match(callbackPattern);
  if (!match) return null;
  return {
    status: match[1] as BookingStatus,
    bookingId: Number(match[2])
  };
}

export { callbackPattern };
