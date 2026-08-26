import { site } from '@/lib/site';
import { BookingForm } from './BookingForm';

export function BookingSection() {
  return (
    <section className="booking-section" id="booking">
      <div className="container booking-layout">
        <div className="booking-copy">
          <div className="eyebrow">Бронирование</div>
          <h2>Планируете<br />отдых?</h2>
          <h3>Оставьте заявку</h3>
          <p>Администратор Monaco свяжется с вами и подтвердит посещение. Отправка формы не является автоматической покупкой билета.</p>

          <div className="telegram-contact">
            <div className="telegram-contact-label">Удобнее через Telegram?</div>
            <a href={site.bookingTelegramUrl} target="_blank" rel="noreferrer">{site.bookingTelegram}</a>
          </div>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}
