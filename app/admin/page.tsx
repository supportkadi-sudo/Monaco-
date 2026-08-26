import { BookingStatus, Prisma } from '@prisma/client';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { BookingStatusActions } from '@/components/admin/BookingStatusActions';
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton';

const statusNames: Record<BookingStatus, string> = {
  NEW: 'Новая',
  CONTACTED: 'Связались',
  CONFIRMED: 'Подтверждена',
  CANCELLED: 'Отменена'
};

function tashkentToday() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function dateValue(key: string) {
  return new Date(`${key}T12:00:00.000Z`);
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = one(params.q)?.trim() || '';
  const date = one(params.date)?.trim() || '';
  const rawStatus = one(params.status)?.trim() || '';
  const status = Object.values(BookingStatus).includes(rawStatus as BookingStatus) ? rawStatus as BookingStatus : undefined;

  const where: Prisma.BookingWhereInput = {};
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) where.visitDate = dateValue(date);
  if (status) where.status = status;
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { phone: { contains: q } },
    { telegram: { contains: q, mode: 'insensitive' } },
    { publicId: { contains: q } }
  ];

  const today = dateValue(tashkentToday());
  const [bookings, todayByStatus, todayVisitors] = await Promise.all([
    prisma.booking.findMany({ where, orderBy: { createdAt: 'desc' }, take: 250 }),
    prisma.booking.groupBy({ by: ['status'], where: { visitDate: today }, _count: { _all: true } }),
    prisma.booking.aggregate({ where: { visitDate: today, status: { not: BookingStatus.CANCELLED } }, _sum: { adults: true, children: true } })
  ]);

  const counts = Object.fromEntries(todayByStatus.map((row) => [row.status, row._count._all])) as Partial<Record<BookingStatus, number>>;
  const visitorCount = (todayVisitors._sum.adults || 0) + (todayVisitors._sum.children || 0);

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div><div className="admin-brand">Monaco Admin</div><small>{admin.email}</small></div>
        <AdminLogoutButton />
      </header>
      <main className="admin-main">
        <h1 className="admin-title">Заявки</h1>
        <section className="admin-stats" aria-label="Сегодня">
          <div className="admin-stat"><span>Новые сегодня</span><strong>{counts.NEW || 0}</strong></div>
          <div className="admin-stat"><span>Подтверждённые</span><strong>{counts.CONFIRMED || 0}</strong></div>
          <div className="admin-stat"><span>Отменённые</span><strong>{counts.CANCELLED || 0}</strong></div>
          <div className="admin-stat"><span>Гостей по заявкам</span><strong>{visitorCount}</strong></div>
        </section>

        <form className="admin-filters" method="get">
          <input name="q" defaultValue={q} placeholder="Имя, телефон, Telegram или № заявки" aria-label="Поиск" />
          <input name="date" type="date" defaultValue={date} aria-label="Дата посещения" />
          <select name="status" defaultValue={status || ''} aria-label="Статус">
            <option value="">Все статусы</option>
            {Object.values(BookingStatus).map((value) => <option key={value} value={value}>{statusNames[value]}</option>)}
          </select>
          <button type="submit">Применить</button>
          <Link href={`/admin?date=${tashkentToday()}`}>Сегодня</Link>
          <Link href="/admin">Сбросить</Link>
        </form>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>№</th><th>Создана</th><th>Посещение</th><th>Гость</th><th>Контакты</th><th>Гости</th><th>Статус</th><th>Действия</th></tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td><Link href={`/admin/bookings/${booking.id}`}>#{booking.publicId ?? booking.id}</Link></td>
                  <td>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Tashkent' }).format(booking.createdAt)}</td>
                  <td>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeZone: 'UTC' }).format(booking.visitDate)}</td>
                  <td>{booking.name}</td>
                  <td>
                    <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                    {booking.telegram ? <><br /><span>{booking.telegram}</span></> : null}
                  </td>
                  <td>{booking.adults} / {booking.children}</td>
                  <td><span className={`status-pill status-${booking.status}`}>{statusNames[booking.status]}</span></td>
                  <td><BookingStatusActions bookingId={booking.id} /></td>
                </tr>
              ))}
              {bookings.length === 0 ? <tr><td colSpan={8}>Заявок по выбранным фильтрам нет.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
