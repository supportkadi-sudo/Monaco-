import { site } from '@/lib/site';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="site-header container">
      <a className="logo" href="#top" aria-label="Monaco Aquapark — на главную">
        <span className="logo-main">MONACO</span>
        <span className="logo-sub">AQUAPARK</span>
      </a>
      <nav className="site-nav" aria-label="Основная навигация">
        <a href="#about">О нас</a>
        <a href="#zones">Зоны</a>
        <a href="#prices">Цены</a>
        <a href="#gallery">Галерея</a>
        <a href="#before-visit">Перед посещением</a>
        <a href="#contacts">Контакты</a>
      </nav>
      <div className="header-actions">
        <a className="header-phone" href={site.phoneHref}>{site.phone}</a>
        <a className="btn" href="#booking">Забронировать</a>
      </div>
      <MobileMenu />
    </header>
  );
}
