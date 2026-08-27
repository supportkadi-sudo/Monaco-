'use client';

import { FormEvent, useMemo, useState } from 'react';
import { tashkentDateKey } from '@/lib/date';
import { prices } from '@/lib/site';
import { bookingInputSchema } from '@/lib/validation/booking';

type FormState = {
  name: string;
  phone: string;
  telegram: string;
  visitDate: string;
  adults: number;
  children: number;
  comment: string;
  website: string;
};

const initialState: FormState = {
  name: '',
  phone: '+998 ',
  telegram: '',
  visitDate: '',
  adults: 2,
  children: 0,
  comment: '',
  website: ''
};

function money(value: number) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} сум`;
}

function isWeekend(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return false;
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 0 || weekday === 6;
}

export function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState<string | null>(null);

  const today = useMemo(() => tashkentDateKey(), []);
  const estimate = useMemo(() => {
    if (!form.visitDate) return null;
    const tariff = isWeekend(form.visitDate) ? prices.weekend : prices.weekday;
    return form.adults * tariff.adult + form.children * tariff.child;
  }, [form.adults, form.children, form.visitDate]);

  function setCount(key: 'adults' | 'children', delta: number) {
    setForm((current) => ({
      ...current,
      [key]: Math.min(30, Math.max(0, current[key] + delta))
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError('');
    const clientParsed = bookingInputSchema.safeParse(form);
    if (!clientParsed.success) {
      setError(clientParsed.error.issues[0]?.message || 'Проверьте данные формы');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientParsed.data)
      });
      const data = await response.json();
      if (!response.ok) {
        const serverError = data?.errors
          ? Object.values(data.errors as Record<string, string[]>).flat().find(Boolean)
          : undefined;
        throw new Error(serverError || data.message || 'Не удалось отправить заявку');
      }
      setSuccessId(data.publicId || '');
      setForm(initialState);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось отправить заявку');
    } finally {
      setLoading(false);
    }
  }

  if (successId !== null) {
    return (
      <div className="form-success" role="status">
        <h3>Заявка принята</h3>
        <p>{successId ? `Номер заявки: #${successId}. ` : ''}Администратор Monaco свяжется с вами для подтверждения бронирования.</p>
        <button className="btn" type="button" onClick={() => setSuccessId(null)}>Оставить ещё одну</button>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="booking-name">Имя</label>
        <input id="booking-name" name="name" autoComplete="name" required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="booking-phone">Телефон</label>
        <input id="booking-phone" name="phone" inputMode="tel" autoComplete="tel" required maxLength={24} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67" />
      </div>
      <div className="field field--full">
        <label htmlFor="booking-telegram">Telegram <span className="field-optional">(необязательно)</span></label>
        <input id="booking-telegram" name="telegram" autoComplete="off" maxLength={120} value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="@username" />
      </div>
      <div className="field field--full">
        <label htmlFor="booking-date">Дата посещения</label>
        <input id="booking-date" name="visitDate" type="date" min={today} required value={form.visitDate} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} />
      </div>

      <div className="counter-grid">
        <div className="counter">
          <span className="counter-label">Взрослые</span>
          <div className="counter-actions">
            <button type="button" aria-label="Уменьшить количество взрослых" onClick={() => setCount('adults', -1)}>−</button>
            <output aria-live="polite" aria-label="Количество взрослых">{form.adults}</output>
            <button type="button" aria-label="Увеличить количество взрослых" onClick={() => setCount('adults', 1)}>+</button>
          </div>
        </div>
        <div className="counter">
          <span className="counter-label">Дети</span>
          <div className="counter-actions">
            <button type="button" aria-label="Уменьшить количество детей" onClick={() => setCount('children', -1)}>−</button>
            <output aria-live="polite" aria-label="Количество детей">{form.children}</output>
            <button type="button" aria-label="Увеличить количество детей" onClick={() => setCount('children', 1)}>+</button>
          </div>
        </div>
      </div>

      {estimate !== null ? (
        <div className="booking-estimate" aria-live="polite">
          <span className="booking-estimate-label">Ориентировочная стоимость</span>
          <strong>{money(estimate)}</strong>
          <small>Детский тариф рассчитан для возраста 5–14 лет; до 5 лет бесплатно. Окончательную стоимость подтвердит администратор.</small>
        </div>
      ) : null}

      <div className="field field--full">
        <label htmlFor="booking-comment">Комментарий</label>
        <textarea id="booking-comment" name="comment" maxLength={1000} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Если есть пожелания — напишите здесь" />
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="booking-website">Website</label>
        <input id="booking-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </div>

      {error ? <p className="form-message form-message--error" role="alert">{error}</p> : null}
      <button className="btn form-submit" type="submit" disabled={loading}>{loading ? 'Отправляем…' : 'Оставить заявку'}</button>
    </form>
  );
}
