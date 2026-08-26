import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a className="logo" href="#top">
          <span className="logo-main">MONACO</span>
          <span className="logo-sub">AQUAPARK</span>
        </a>
        <nav className="footer-nav" aria-label="Навигация в подвале">
          <a href="#about">О нас</a>
          <a href="#zones">Зоны</a>
          <a href="#prices">Цены</a>
          <a href="#gallery">Галерея</a>
          <a href="#contacts">Контакты</a>
        </nav>
        <div className="footer-meta">
          <div><a href={site.phoneHref}>{site.phone}</a></div>
          <div>{site.shortAddress}</div>
          <div>{site.hours}</div>
          <div><a href={site.instagramUrl} target="_blank" rel="noreferrer">{site.instagram}</a></div>
        </div>
      </div>
    </footer>
  );
}

export function MobileCta() {
  return (
    <div className="mobile-cta" aria-label="Быстрые действия">
      <a href={site.phoneHref}>Позвонить</a>
      <a href="#booking">Забронировать</a>
    </div>
  );
}
