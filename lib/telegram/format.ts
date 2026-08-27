import type { Booking, BookingStatus } from '@prisma/client';
import { telegramProfileUrl } from '@/lib/telegram/contact';

const labels: Record<BookingStatus, string> = {
  NEW: '🆕 Новая',
  CONTACTED: '📞 Связались',
  CONFIRMED: '✅ Подтверждена',
  CANCELLED: '❌ Отменена'
};

function esc(value: string) {
  return value.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]!);
}

export function bookingTelegramText(booking: Booking) {
  const created = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Tashkent'
  }).format(booking.createdAt);
  const visit = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeZone: 'Asia/Tashkent'
  }).format(booking.visitDate);
  const telegramUrl = telegramProfileUrl(booking.telegram);
  const telegram = booking.telegram
    ? telegramUrl
      ? `<a href="${telegramUrl}">${esc(booking.telegram)}</a>`
      : esc(booking.telegram)
    : '—';

  return [
    `<b>${labels[booking.status]} заявка #${booking.publicId ?? booking.id}</b>`,
    '',
    `<b>Имя:</b> ${esc(booking.name)}`,
    `<b>Телефон:</b> <code>${esc(booking.phone)}</code>`,
    `<b>Telegram:</b> ${telegram}`,
    `<b>Дата:</b> ${visit}`,
    `<b>Взрослых:</b> ${booking.adults}`,
    `<b>Детей:</b> ${booking.children}`,
    '',
    '<b>Комментарий:</b>',
    booking.comment ? esc(booking.comment) : '—',
    '',
    `<b>Создана:</b> ${created}`,
    `<b>Статус:</b> ${labels[booking.status]}`
  ].join('\n');
}

export function statusLabel(status: BookingStatus) {
  return labels[status];
}
