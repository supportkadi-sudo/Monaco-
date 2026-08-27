import { media, site } from '@/lib/site';
import { HeroMedia } from './HeroMedia';

export function HeroSection() {
  return (
    <>
      <section className="hero" id="top">
        <HeroMedia image={media.hero} />
        <div className="hero-wire" aria-hidden="true" />
        <div className="hero-content container">
          <h1 className="hero-title">MONACO<br />AQUAPARK</h1>
          <p className="hero-kicker">Крытый аквапарк в Ташкенте</p>
          <div className="hero-rule" aria-hidden="true" />
          <p className="hero-emotion">
            <span>Отдых,</span>
            <span>к которому хочется</span>
            <span>вернуться</span>
          </p>
          <div className="hero-actions">
            <a className="btn" href="#booking">Забронировать</a>
            <a className="btn btn-outline btn-hero-secondary" href="#prices">Цены</a>
          </div>
        </div>
      </section>
      <div className="hero-facts">
        <div className="hero-facts-inner container">
          <div className="fact">
            <span className="fact-icon" aria-hidden="true">◷</span>
            <div><div className="fact-label">Режим работы</div><div className="fact-value">{site.hours}</div></div>
          </div>
          <div className="fact">
            <span className="fact-icon" aria-hidden="true">⌖</span>
            <div><div className="fact-label">Адрес</div><div className="fact-value">{site.shortAddress}</div></div>
          </div>
          <div className="fact">
            <span className="fact-icon" aria-hidden="true">☎</span>
            <div><div className="fact-label">Телефон</div><a className="fact-value" href={site.phoneHref}>{site.phone}</a></div>
          </div>
        </div>
      </div>
    </>
  );
}
