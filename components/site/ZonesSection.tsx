import Image from 'next/image';
import { media } from '@/lib/site';

export function ZonesSection() {
  return (
    <section className="section" id="zones">
      <div className="container">
        <div className="section-head" id="about">
          <div>
            <div className="eyebrow">Monaco / Tashkent</div>
            <h2 className="section-title">Отдых в Monaco</h2>
          </div>
          <p className="section-lead">Крытый комплекс для отдыха круглый год: бассейны, детские зоны и пространство для спокойного отдыха.</p>
        </div>

        <div className="zones-grid">
          <div className="zone-copy">
            <div className="zone-number">01</div>
            <div>
              <h3 className="zone-title">Бассейны</h3>
              <p>Взрослый и детский бассейны в закрытом помещении с комфортной температурой круглый год.</p>
            </div>
          </div>
          <div className="zone-media zone-media--wide">
            <Image src={media.pool} alt="Бассейн Monaco Aquapark в Ташкенте" fill sizes="(max-width: 820px) 100vw, 50vw" />
          </div>

          <div className="zone-media zone-media--tall zone-two">
            <Image src={media.ship} alt="Корабль в бассейне Monaco Aquapark" fill sizes="(max-width: 820px) 100vw, 50vw" />
          </div>
          <div className="zone-copy zone-two">
            <div className="zone-number">02</div>
            <div>
              <h3 className="zone-title">Для детей</h3>
              <p>Для маленьких гостей предусмотрены специальные зоны с неглубокими бассейнами и семейным форматом отдыха.</p>
            </div>
          </div>

          <div className="zone-copy zone-three">
            <div className="zone-number">03</div>
            <div>
              <h3 className="zone-title">SPA</h3>
              <p>Финские сауны, турецкие хаммамы, гидромассаж и джакузи для спокойного восстановления после воды.</p>
            </div>
          </div>
          <div className="zone-media zone-media--wide zone-three">
            <Image src={media.sauna} alt="Сауна в Monaco Aquapark" fill sizes="(max-width: 820px) 100vw, 50vw" />
          </div>

          <div className="amenities" aria-label="Услуги Monaco Aquapark">
            <div className="amenity">Хаммам</div>
            <div className="amenity">Сауна</div>
            <div className="amenity">Джакузи</div>
            <div className="amenity">Фуд-корт</div>
          </div>
        </div>
      </div>
    </section>
  );
}
