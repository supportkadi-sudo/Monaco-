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
        </div>
        <BookingForm />
      </div>
    </section>
  );
}
