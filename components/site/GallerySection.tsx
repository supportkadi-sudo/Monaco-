'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { media } from '@/lib/site';

const items = [
  { src: media.pool, alt: 'Бассейн Monaco Aquapark' },
  { src: media.ship, alt: 'Корабль с надписью MONACO в бассейне' },
  { src: media.sauna, alt: 'Сауна Monaco Aquapark' },
  { src: media.hero, alt: 'Пространство Monaco Aquapark' },
  { src: media.party, alt: 'Событие в Monaco Aquapark' }
];

export function GallerySection() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') setActive((value) => value === null ? null : (value + 1) % items.length);
      if (event.key === 'ArrowLeft') setActive((value) => value === null ? null : (value - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="gallery-head">
          <div>
            <div className="eyebrow">A day at Monaco</div>
            <h2 className="section-title">Галерея Monaco</h2>
          </div>
          <span className="section-lead">Настоящие фотографии комплекса</span>
        </div>
        <div className="gallery-grid">
          {items.map((item, index) => (
            <button className="gallery-item" key={`${item.src}-${index}`} onClick={() => setActive(index)} aria-label={`Открыть фото: ${item.alt}`}>
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 820px) 50vw, 35vw" />
            </button>
          ))}
        </div>
      </div>

      {active !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setActive(null)}>
          <button className="lightbox-close" aria-label="Закрыть" onClick={() => setActive(null)}>×</button>
          <Image src={items[active].src} alt={items[active].alt} width={1400} height={1000} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </section>
  );
}
