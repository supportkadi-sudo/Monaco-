import { BookingStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdmin } from '@/lib/auth';
import { updateBookingStatus } from '@/lib/booking/service';
import { syncBookingTelegramMessages } from '@/lib/telegram/notify';

const schema = z.object({ status: z.nativeEnum(BookingStatus) });

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const { id } = await context.params;
  const bookingId = Number(id);
  if (!Number.isInteger(bookingId)) {
    return NextResponse.json({ ok: false, message: 'Некорректный ID' }, { status: 400 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Некорректный статус' }, { status: 422 });
  }

  try {
    const booking = await updateBookingStatus(bookingId, parsed.data.status);
    try {
      await syncBookingTelegramMessages(bookingId);
    } catch (error) {
      console.error('Telegram status sync failed', error);
    }
    return NextResponse.json({ ok: true, status: booking.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: 'Заявка не найдена' }, { status: 404 });
  }
}
