import { NextRequest, NextResponse } from 'next/server';
import { bookingInputSchema } from '@/lib/validation/booking';
import { checkBookingRateLimit } from '@/lib/rate-limit';
import { createBooking } from '@/lib/booking/service';
import { notifyAdminsAboutBooking } from '@/lib/telegram/notify';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkBookingRateLimit(ip);

  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: 'Слишком много попыток. Попробуйте немного позже.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Некорректный запрос' }, { status: 400 });
  }

  const parsed = bookingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: 'Проверьте данные формы', errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const booking = await createBooking(parsed.data);

    try {
      await notifyAdminsAboutBooking(booking);
    } catch (error) {
      console.error('Booking saved, but Telegram notification failed', error);
    }

    return NextResponse.json({ ok: true, publicId: booking.publicId }, { status: 201 });
  } catch (error) {
    console.error('Booking creation failed', error);
    return NextResponse.json(
      { ok: false, message: 'Не удалось сохранить заявку. Попробуйте ещё раз.' },
      { status: 500 }
    );
  }
}
