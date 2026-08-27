import { prices } from '@/lib/site';

function money(value: number) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} сум`;
}

export function PricesSection() {
  return (
    <section className="section prices-section" id="prices">
      <div className="container prices-layout">
        <div>
          <div className="eyebrow">Стоимость посещения</div>
          <h2 className="prices-title">Цены</h2>
        </div>

        <div className="prices-columns">
          <div className="price-column">
            <div className="price-heading">Будни</div>
            <div className="price-sub">Понедельник — пятница</div>
            <div className="price-row"><span>Взрослый</span><span className="price-dots" /><span className="price-value">{money(prices.weekday.adult)}</span></div>
            <div className="price-row"><span>Детский</span><span className="price-dots" /><span className="price-value">{money(prices.weekday.child)}</span></div>
          </div>
          <div className="price-column">
            <div className="price-heading">Выходные</div>
            <div className="price-sub">Суббота — воскресенье</div>
            <div className="price-row"><span>Взрослый</span><span className="price-dots" /><span className="price-value">{money(prices.weekend.adult)}</span></div>
            <div className="price-row"><span>Детский</span><span className="price-dots" /><span className="price-value">{money(prices.weekend.child)}</span></div>
          </div>
          <p className="price-note">{prices.note}</p>
        </div>
      </div>
    </section>
  );
}
