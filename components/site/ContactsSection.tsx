import { site } from '@/lib/site';

export function ContactsSection() {
  return (
    <section className="contacts-section" id="contacts">
      <div className="container contacts-layout">
        <div className="contacts-copy">
          <div className="eyebrow">Контакты</div>
          <h2>Monaco Aquapark</h2>
          <div className="contact-list">
            <div><div className="contact-label">Адрес</div><div className="contact-value">{site.address}</div></div>
            <div><div className="contact-label">Телефон</div><a className="contact-value" href={site.phoneHref}>{site.phone}</a></div>
            <div><div className="contact-label">Email</div><a className="contact-value" href={site.emailHref}>{site.email}</a></div>
            <div><div className="contact-label">Instagram</div><a className="contact-value" href={site.instagramUrl} target="_blank" rel="noreferrer">{site.instagram}</a></div>
            <div><div className="contact-label">Режим работы</div><div className="contact-value">{site.hours}</div></div>
          </div>
          <a className="btn route-btn" href={site.routeUrl} target="_blank" rel="noreferrer">Построить маршрут</a>
        </div>
        <iframe className="map-frame" title="Monaco Aquapark на карте" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={site.mapEmbedUrl} />
      </div>
    </section>
  );
}
