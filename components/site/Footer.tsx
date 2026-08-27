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
          <a href="#before-visit">Перед посещением</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div className="footer-links" aria-label="Ссылки Monaco Aquapark">
          <span className="footer-links-label">Monaco online</span>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer">
            Instagram <span aria-hidden="true">↗</span>
          </a>
          <a href={site.officialUrl} target="_blank" rel="noreferrer">
            Официальный сайт <span aria-hidden="true">↗</span>
          </a>
          <a href={site.routeUrl} target="_blank" rel="noreferrer">
            Маршрут <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="footer-meta">
          <div><a href={site.phoneHref}>{site.phone}</a></div>
          <div><a href={site.emailHref}>{site.email}</a></div>
          <div>{site.shortAddress}</div>
          <div>{site.hours}</div>
          <div><a href={site.instagramUrl} target="_blank" rel="noreferrer">{site.instagram}</a></div>
        </div>
      </div>
    </footer>
  );
}
