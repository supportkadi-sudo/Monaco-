import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingStatus } from '@prisma/client';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { BookingStatusActions } from '@/components/admin/BookingStatusActions';

const statusNames: Record<BookingStatus, string> = {
  NEW: 'Новая',
  CONTACTED: 'Связались',
  CONFIRMED: 'Подтверждена',
  CANCELLED: 'Отменена'
};

export default async function AdminBookingPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isInteger(bookingId)) notFound();

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) notFound();

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-brand">Monaco Admin</div>
        <Link href="/admin">← К заявкам</Link>
      </header>
      <main className="admin-main">
        <h1 className="admin-title">Заявка #{booking.publicId ?? booking.id}</h1>
        <div className="admin-table-wrap" style={{ padding: 24 }}>
          <p><strong>Статус:</strong> <span className={`status-pill status-${booking.status}`}>{statusNames[booking.status]}</span></p>
          <p><strong>Имя:</strong> {booking.name}</p>
          <p><strong>Телефон:</strong> <a href={`tel:${booking.phone}`}>{booking.phone}</a></p>
          <p><strong>Telegram:</strong> {booking.telegram || '—'}</p>
          <p><strong>Дата посещения:</strong> {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long', timeZone: 'UTC' }).format(booking.visitDate)}</p>
          <p><strong>Взрослых:</strong> {booking.adults}</p>
          <p><strong>Детей:</strong> {booking.children}</p>
          <p><strong>Комментарий:</strong> {booking.comment || '—'}</p>
          <p><strong>Создана:</strong> {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Tashkent' }).format(booking.createdAt)}</p>
          <BookingStatusActions bookingId={booking.id} />
        </div>
      </main>
    </div>
  );
}
